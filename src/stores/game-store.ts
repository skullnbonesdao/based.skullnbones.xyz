import { defineStore } from 'pinia'
import { GAME_PROGRAM_ID, useWorkspaceAdapter } from 'components/staratlas/connector'
import { readFromRPCOrError } from '@staratlas/data-source'
import { useRPCStore } from 'stores/rpcStore'
import { Game } from '@staratlas/sage'
import { SagePlayerProfile } from '@staratlas/sage/src'
import { usePlayerProfileStore } from 'stores/player-profile-store'

export const useGameStore = defineStore('GameStore', {
  state: () => ({
    gameID: GAME_PROGRAM_ID,
    game: undefined as Game | undefined,
    sagePlayerProfile: undefined as SagePlayerProfile | undefined,
  }),

  actions: {
    async updateStore() {
      this.game = undefined
      this.sagePlayerProfile = undefined

      try {
        this.game = await readFromRPCOrError(
          useRPCStore().connection,
          useWorkspaceAdapter()!.sageProgram.value,
          this.gameID,
          Game,
          'confirmed',
        )

        if (usePlayerProfileStore().hasProfile) {
          const sageProfileKey = SagePlayerProfile.findAddress(
            useWorkspaceAdapter()!.sageProgram.value,
            usePlayerProfileStore()!.playerProfile!.key,
            this.gameID,
          )[0]

          this.sagePlayerProfile = await readFromRPCOrError(
            useRPCStore().connection,
            useWorkspaceAdapter()!.sageProgram.value,
            sageProfileKey,
            SagePlayerProfile,
          )
        }
      } catch (error) {
        console.warn(`[${this.$id}] waring:`, error)
      } finally {
        console.log(`[${this.$id}] updated`)
      }
    },
  },
})
