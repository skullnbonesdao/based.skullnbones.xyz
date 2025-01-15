import { defineStore } from 'pinia'
import { PublicKey } from '@solana/web3.js'
import type { Game, Ship, Starbase } from '@staratlas/sage'
import { loadGame, loadShips, loadStarbases } from 'src/handler/interfaces/GameInterface'

const STORE_NAME = 'gameStore'
const STORE_STARBASE = STORE_NAME + '_STARBASE'

export const useGameStore = defineStore(STORE_NAME, {
  state: () => ({
    wallet: undefined as PublicKey | undefined,
    gameID: new PublicKey('GAMEzqJehF8yAnKiTARUuhZMvLvkZVAsCVri5vSfemLr'),
    cargoStatsDefinition: new PublicKey('CSTatsVpHbvZmwHbCjZKVfYQT5JXfsXccXufhEcwCqTg'),
    game: undefined as Game | undefined,
    starbases: [] as Starbase[] | undefined,
    ships: [] as Ship[] | undefined,
    starbase: loadLocalStarbase() as Starbase | undefined,
  }),

  actions: {
    async updateStore() {
      try {
        this.game = await loadGame(this.gameID)
        this.starbases = await loadStarbases()
        this.ships = await loadShips()
      } catch (error) {
        console.error(`[${this.$id}] waring:`, error)
      } finally {
        console.log(`[${this.$id}] updated`)
      }
    },

    setStarbase(selectedStarbase: Starbase) {
      this.starbase = selectedStarbase
      localStorage.setItem('STORE_STARBASE', JSON.stringify(selectedStarbase))
      console.log('[STORE_STARBASE]')
    },
  },
})

// Utility function for safely loading a Starbase from localStorage
function loadLocalStarbase(): Starbase | undefined {
  try {
    const saved = localStorage.getItem(STORE_STARBASE)
    return saved ? (JSON.parse(saved) as Starbase) : undefined
  } catch (error) {
    console.error(`Error loading 'starbase' from localStorage`, error)
    return undefined
  }
}
