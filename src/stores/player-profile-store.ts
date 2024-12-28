import { defineStore } from 'pinia'
import { PublicKey } from '@solana/web3.js'
import { useRPCStore } from 'stores/rpcStore'
import { AnchorProvider, Program } from '@staratlas/anchor'
import { PLAYER_PROFILE_IDL, PlayerProfile } from '@staratlas/player-profile'
import { readFromRPCOrError } from '@staratlas/data-source'
import { useAnchorWallet } from 'solana-wallets-vue'

export const usePlayerProfileStore = defineStore('playerProfile', {
  state: () => ({
    hasProfile: false,
    wallet: undefined as PublicKey | undefined,
    profileKey: undefined as PublicKey | undefined,
    profileData: undefined as PlayerProfile | undefined,
  }),

  actions: {
    async updateStore() {
      if (this.wallet) {
        const [accountInfo] = await useRPCStore().connection.getProgramAccounts(
          new PublicKey('pprofELXjL5Kck7Jn5hCpwAL82DpTkSYBENzahVtbc9'),
          {
            filters: [
              {
                memcmp: {
                  offset: 30, // PlayerProfile.MIN_DATA_SIZE + 2
                  bytes: this.wallet!.toBase58(),
                },
              },
            ],
          },
        )

        if (accountInfo?.pubkey) {
          this.profileKey = accountInfo.pubkey

          const provider = new AnchorProvider(
            useRPCStore().connection,
            useAnchorWallet().value!,
            AnchorProvider.defaultOptions(),
          )

          const program = new Program(
            PLAYER_PROFILE_IDL,
            new PublicKey('pprofELXjL5Kck7Jn5hCpwAL82DpTkSYBENzahVtbc9'),
            provider,
          )

          this.profileData = await readFromRPCOrError(
            useRPCStore().connection,
            program,
            this.profileKey,
            PlayerProfile,
            'confirmed',
          )
        }
      }
      console.log('[PlayerProfileStore] updated')
    },
  },
})
