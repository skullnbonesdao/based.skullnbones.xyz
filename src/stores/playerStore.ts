import { defineStore } from 'pinia'
import type { StarbasePlayer } from '@staratlas/sage'
import { loadFleets, loadStarbasePlayer } from 'src/handler/interfaces/GameInterface'
import type { Fleet } from '@staratlas/sage/src'

const STORE_NAME = 'playerStore'

export const usePlayerStore = defineStore(STORE_NAME, {
  state: () => ({
    fleets: [] as Fleet[] | undefined,
    starbasePlayer: undefined as StarbasePlayer | undefined,
  }),

  actions: {
    async updateStore() {
      try {
        this.fleets = await loadFleets()
      } catch (error) {
        console.error(`[${this.$id}] waring:`, error)
      } finally {
        console.log(`[${this.$id}] updated`)
      }
    },
    async updateStarbasePlayer() {
      try {
        this.starbasePlayer = await loadStarbasePlayer()
      } catch (error) {
        console.error(`[${this.$id}] waring:`, error)
      } finally {
        console.log(`[${this.$id}] updated starbase player`)
      }
    },
  },
})
