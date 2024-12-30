import { defineStore } from 'pinia'
import { usePlayerProfileStore } from 'stores/player-profile-store'
import { PublicKey } from '@solana/web3.js'
import { UserPoints } from '@staratlas/points'
import { readFromRPCOrError } from '@staratlas/data-source'
import { useRPCStore } from 'stores/rpcStore'
import { useWorkspaceAdapter } from 'components/staratlas/connector'

export const usePointsStore = defineStore('Points', {
  state: () => ({
    pointsCategories: [
      {
        name: 'LP',
        key: new PublicKey('LPkmmDQG8iBDAfKkWN6QadeoiLSvD1p3fGgq8m8QdMu'),
        pointsCategory: undefined as UserPoints | undefined,
      },
      {
        name: 'Pilot',
        key: new PublicKey('PiLotBQoUBUvKxMrrQbuR3qDhqgwLJctWsXj3uR7fGs'),
        pointsCategory: undefined as UserPoints | undefined,
      },
      {
        name: 'Data',
        key: new PublicKey('DataJpxFgHhzwu4zYJeHCnAv21YqWtanEBphNxXBHdEY'),
        pointsCategory: undefined as UserPoints | undefined,
      },
      {
        name: 'Mine',
        key: new PublicKey('MineMBxARiRdMh7s1wdStSK4Ns3YfnLjBfvF5ZCnzuw'),
        PointsCategory: undefined as UserPoints | undefined,
      },
      {
        name: 'Craft',
        key: new PublicKey('CraftndAV62acibnaW7TiwEYwu8MmJZBdyrfyN54nre7'),
        pointsCategory: undefined as UserPoints | undefined,
      },
    ],
  }),

  actions: {
    async updateStore() {
      try {
        if (usePlayerProfileStore().wallet) {
          for (const category of this.pointsCategories) {
            try {
              const idx = this.pointsCategories.indexOf(category)
              this.pointsCategories[idx]!.pointsCategory = await readFromRPCOrError(
                useRPCStore().connection,
                useWorkspaceAdapter()!.pointsProgram.value,
                UserPoints.findAddress(
                  useWorkspaceAdapter()!.pointsProgram.value!,
                  category.key,
                  usePlayerProfileStore().playerProfile!.key,
                )[0],
                UserPoints,
              )
            } catch (error) {
              console.warn(`[${this.$id}] account not found continue...`)
            }
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
