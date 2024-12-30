import { defineStore } from 'pinia'
import { PublicKey } from '@solana/web3.js'
import { useRPCStore } from 'stores/rpcStore'
import { PlayerName, PlayerProfile } from '@staratlas/player-profile'
import { readFromRPCOrError } from '@staratlas/data-source'
import {
  GAME_ID,
  PLAYER_PROFILE_PROGRAM_ID,
  useWorkspaceAdapter,
} from 'components/staratlas/connector'
import { SagePlayerProfile } from '@staratlas/sage'

export const usePlayerProfileStore = defineStore('playerProfile', {
  state: () => ({
    hasProfile: false,
    wallet: undefined as PublicKey | undefined,
    playerProfile: undefined as PlayerProfile | undefined,
    playerName: undefined as PlayerName | undefined,
  }),

  actions: {
    async updateStore() {
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

          console.log(
            SagePlayerProfile.findAddress(
              useWorkspaceAdapter()!.sageProgram.value,
              profileKey,
              GAME_ID,
            ),
          )
        }
      }

      console.log('[PlayerProfileStore] updated')
    },
  },
})
