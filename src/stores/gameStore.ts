import { defineStore } from 'pinia'
import { PublicKey } from '@solana/web3.js'
import type { Game, MineItem, Planet, Resource, Sector, Ship, Starbase } from '@staratlas/sage'
import {
  loadGame,
  loadMineItem,
  loadPlanets,
  loadResources,
  loadShips,
  loadStarbases,
} from 'src/handler/interfaces/GameInterface'
import { byteArrayToString } from '@staratlas/data-source'

const STORE_NAME = 'gameStore'

export const useGameStore = defineStore(STORE_NAME, {
  state: () => ({
    gameID: new PublicKey('GAMEzqJehF8yAnKiTARUuhZMvLvkZVAsCVri5vSfemLr'),

    game: undefined as Game | undefined,
    starbases: [] as Starbase[] | undefined,
    sectors: [] as Sector[] | undefined,
    mineItems: [] as MineItem[] | undefined,
    planets: [] as Planet[] | undefined,
    resources: [] as Resource[] | undefined,
    ships: [] as Ship[] | undefined,
  }),
  getters: {
    getStarbaseNameByCoordinates: (state) => {
      return (coordinates: [number, number]) => {
        const starbase = state.starbases?.find((starbase) =>
          byteArrayToString(starbase.data?.name).includes(`x: ${coordinates[0]}, y: -39`),
        )

        if (starbase) return byteArrayToString(starbase.data.name)
        return 'NOT FOUND!'
      }
    },
  },

  actions: {
    async updateStore() {
      try {
        this.game = await loadGame(this.gameID)
        this.starbases = await loadStarbases()
        //this.sectors = await loadSectors()
        this.mineItems = await loadMineItem()
        this.planets = await loadPlanets()
        this.resources = await loadResources()
        this.ships = await loadShips()
      } catch (error) {
        console.error(`[${this.$id}] waring:`, error)
      } finally {
        console.log(`[${this.$id}] updated`)
      }
    },
  },
})
