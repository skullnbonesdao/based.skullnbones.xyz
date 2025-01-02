import { defineStore } from 'pinia'
import { useWorkspaceAdapter } from 'components/staratlas/connector'
import { Starbase } from '@staratlas/sage'
import { PublicKey } from '@solana/web3.js'
import { readFromRPCOrError } from '@staratlas/data-source'
import { useRPCStore } from 'stores/rpcStore'

interface StarbaseAccount {
  publicKey: PublicKey
  account: StarbaseAccount
}

export const useStarbaseStore = defineStore('StarBaseStore', {
  state: () => ({
    starbases: undefined as StarbaseAccount[] | undefined,
    starbaseSelected: undefined as StarbaseAccount | undefined,
    starbase: undefined as Starbase | undefined,
    starbasePlayerProfile: undefined as SagePlayerProfile | undefined,
  }),

  actions: {
    async updateStore() {
      this.starbases = undefined

      try {
        this.starbases = await useWorkspaceAdapter()?.sageProgram.value.account.starbase.all()

        this.starbase = await readFromRPCOrError(
          useRPCStore().connection,
          useWorkspaceAdapter()!.sageProgram.value,
          this.starbaseSelected!.publicKey,
          Starbase,
        )
      } catch (error) {
        console.warn(`[${this.$id}] waring:`, error)
      } finally {
        console.log(`[${this.$id}] updated`)
      }
    },
  },
})
