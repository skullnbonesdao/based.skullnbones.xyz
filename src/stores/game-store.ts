import { defineStore } from 'pinia'
import { GAME_ID, useWorkspaceAdapter } from 'components/staratlas/connector'
import { readFromRPCOrError } from '@staratlas/data-source'
import { useRPCStore } from 'stores/rpcStore'
import { Game } from '@staratlas/sage'
import { SagePlayerProfile } from '@staratlas/sage/src'
import { usePlayerProfileStore } from 'stores/player-profile-store'

export const useGameStore = defineStore('gameStore', {
  state: () => ({
    gameID: GAME_ID,
    game: {} as Game | undefined,

    sagePlayerProfile: {} as SagePlayerProfile | undefined,
  }),

  actions: {
    async updateStore() {
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

      console.log('[GameStore] updated')
    },
  },
})
