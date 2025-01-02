import { defineStore } from 'pinia'
import { useWorkspaceAdapter } from 'components/staratlas/connector'
import { usePlayerProfileStore } from 'stores/player-profile-store'
import { ProfileFactionAccount } from '@staratlas/profile-faction'
import { readFromRPCOrError } from '@staratlas/data-source'
import { useRPCStore } from 'stores/rpcStore'

export const useFactionStore = defineStore('factionStore', {
  state: () => ({
    profileFaction: undefined as ProfileFactionAccount | undefined,
  }),

  actions: {
    async updateStore() {
      this.profileFaction = undefined
      try {
        if (usePlayerProfileStore().hasProfile) {
          const profileFactionKey = ProfileFactionAccount.findAddress(
            useWorkspaceAdapter()!.profileFactionProgram.value,
            usePlayerProfileStore()!.playerProfile!.key,
          )[0]

          this.profileFaction = await readFromRPCOrError(
            useRPCStore().connection,
            useWorkspaceAdapter()!.profileFactionProgram.value,
            profileFactionKey,
            ProfileFactionAccount,
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
