import { defineStore } from 'pinia'
import { PublicKey } from '@solana/web3.js'
import type { Game, Ship, Starbase } from '@staratlas/sage'
import { loadGame, loadShips, loadStarbases } from 'src/handler/interfaces/GameInterface'

export const useGameStore = defineStore('gameStore', {
  state: () => ({
    wallet: undefined as PublicKey | undefined,
    gameID: new PublicKey('GAMEzqJehF8yAnKiTARUuhZMvLvkZVAsCVri5vSfemLr'),
    cargoStatsDefinition: new PublicKey('CSTatsVpHbvZmwHbCjZKVfYQT5JXfsXccXufhEcwCqTg'),
    game: undefined as Game | undefined,
    starbases: [] as Starbase[] | undefined,
    ships: [] as Ship[] | undefined,
    starbase: undefined as Starbase | undefined,
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
  },
})
