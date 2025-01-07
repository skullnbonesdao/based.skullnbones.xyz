import { defineStore } from 'pinia'
import { useWorkspaceAdapter } from 'components/staratlas/connector'
import { SagePlayerProfile, Starbase, StarbasePlayer } from '@staratlas/sage'
import { PublicKey } from '@solana/web3.js'
import { readAllFromRPC, readFromRPCOrError } from '@staratlas/data-source'
import { useRPCStore } from 'stores/rpcStore'
import { usePlayerProfileStore } from 'stores/player-profile-store'
import { useGameStore } from 'stores/game-store'

interface StarbaseAccount {
  publicKey: PublicKey
  account: StarbaseAccount
}

export const useStarbaseStore = defineStore('StarBaseStore', {
  state: () => ({
    starbases: [] as Starbase[] | undefined,
    starbase: undefined as Starbase | undefined,
    starbasePlayer: undefined as StarbasePlayer | undefined,
  }),

  actions: {
    async updateStore() {
      this.starbases = []

      try {
        if (!this.starbases.length) {
          const temp = await readAllFromRPC(
            useRPCStore().connection,
            useWorkspaceAdapter()!.sageProgram.value!,
            Starbase,
          )

          temp.map((d) => {
            if (d.type == 'ok') {
              this.starbases!.push(
                new Starbase(d.data.data, d.data.key, d.data.upgradeIngredientAmounts),
              )
            }
          })
        }

        if (this.starbase) {
          this.starbasePlayer = await readFromRPCOrError(
            useRPCStore().connection,
            useWorkspaceAdapter()!.sageProgram.value,
            StarbasePlayer.findAddress(
              useWorkspaceAdapter()!.sageProgram.value,
              this.starbase!.key,
              SagePlayerProfile.findAddress(
                useWorkspaceAdapter()!.sageProgram.value,
                usePlayerProfileStore().playerProfile!.key,
                useGameStore().gameID,
              )[0],
              this.starbase!.data.seqId,
            )[0],
            StarbasePlayer,
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
