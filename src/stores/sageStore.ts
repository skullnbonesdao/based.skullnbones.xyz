import { defineStore } from 'pinia'
import { PublicKey } from '@solana/web3.js'
import { Game } from '@staratlas/sage'
import { loadGame } from 'src/handler/interfaces/SageInterface'

export const useSageStore = defineStore('sageStore', {
  state: () => ({
    wallet: undefined as PublicKey | undefined,
    gameID: new PublicKey('GAMEzqJehF8yAnKiTARUuhZMvLvkZVAsCVri5vSfemLr'),
    game: undefined as Game | undefined,
  }),

  actions: {
    async updateStore() {
      try {
        this.game = await loadGame(this.gameID)
      } catch (error) {
        console.error(`[${this.$id}] waring:`, error)
      } finally {
        console.log(`[${this.$id}] updated`)
      }
    },
  },
})
