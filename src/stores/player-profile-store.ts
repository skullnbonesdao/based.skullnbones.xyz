import { defineStore } from 'pinia'
import { PublicKey } from '@solana/web3.js'
import { useRPCStore } from 'stores/rpcStore'
import { PlayerName, PlayerProfile } from '@staratlas/player-profile'
import { readFromRPCOrError } from '@staratlas/data-source'
import { PLAYER_PROFILE_PROGRAM_ID, useWorkspaceAdapter } from 'components/staratlas/connector'

export const usePlayerProfileStore = defineStore('playerProfile', {
  state: () => ({
    hasProfile: false,
    wallet: undefined as PublicKey | undefined,
    playerProfile: undefined as PlayerProfile | undefined,
    playerName: undefined as PlayerName | undefined,
  }),

  actions: {
    async updateStore() {
      try {
        if (this.wallet) {
          const [accountInfo] = await useRPCStore().connection.getProgramAccounts(
            PLAYER_PROFILE_PROGRAM_ID,
            {
              filters: [
                {
                  memcmp: {
                    offset: PlayerProfile.MIN_DATA_SIZE + 2,
                    bytes: this.wallet!.toBase58(),
                  },
                },
              ],
            },
          )

          if (accountInfo?.pubkey) {
            const profileKey = accountInfo.pubkey
            this.hasProfile = true

            this.playerProfile = await readFromRPCOrError(
              useRPCStore().connection,
              useWorkspaceAdapter()!.playerProfileProgram.value,
              profileKey,
              PlayerProfile,
              'confirmed',
            )

            const profileNameKey = PlayerName.findAddress(
              useWorkspaceAdapter()!.playerProfileProgram.value,
              profileKey,
            )[0]

            this.playerName = await readFromRPCOrError(
              useRPCStore().connection,
              useWorkspaceAdapter()!.playerProfileProgram.value,
              profileNameKey,
              PlayerName,
              'confirmed',
            )
          }
        }
      } catch (error) {
        console.warn(`[${this.$id}] waring:`, error)
      } finally {
        console.log(`[${this.$id}] updated`)
      }
    },
  },
})
