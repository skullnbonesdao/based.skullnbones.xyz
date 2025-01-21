import { defineStore } from 'pinia'
import { PublicKey } from '@solana/web3.js'
import type { Game, Ship, Starbase, StarbasePlayer } from '@staratlas/sage'
import {
  loadFleets,
  loadGame,
  loadShips,
  loadStarbasePlayer,
  loadStarbases,
} from 'src/handler/interfaces/GameInterface'
import { Fleet } from '@staratlas/sage/src'

const STORE_NAME = 'gameStore'
const STARBASE_LOCALSTORAGE_KEY = 'gameStore_starbase'

export const useGameStore = defineStore(STORE_NAME, {
  state: () => ({
    wallet: undefined as PublicKey | undefined,
    gameID: new PublicKey('GAMEzqJehF8yAnKiTARUuhZMvLvkZVAsCVri5vSfemLr'),
    cargoStatsDefinition: new PublicKey('CSTatsVpHbvZmwHbCjZKVfYQT5JXfsXccXufhEcwCqTg'),
    game: undefined as Game | undefined,
    starbases: [] as Starbase[] | undefined,
    ships: [] as Ship[] | undefined,
    starbase: undefined as Starbase | undefined,
    fleets: [] as Fleet[] | undefined,
    starbasePlayer: undefined as StarbasePlayer | undefined,
  }),

  actions: {
    initStore() {
      const localStarbase = localStorage.getItem(STARBASE_LOCALSTORAGE_KEY)
      if (localStarbase) {
        try {
          // parse the saved data and set it in the store
          const parsed = JSON.parse(localStarbase) as Starbase
          this.starbase = parsed
        } catch (err) {
          this.starbase = undefined
          console.warn(`[${this.$id}]parsing stored starbase`, err)
        }
      }
    },
    async updateStore() {
      try {
        this.game = await loadGame(this.gameID)
        this.starbases = await loadStarbases()
        this.ships = await loadShips()
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
        console.log(`[${this.$id}] updated`)
      }
    },
    setStarbase() {
      localStorage.setItem(STARBASE_LOCALSTORAGE_KEY, JSON.stringify(this.starbase))
    },
  },
})
