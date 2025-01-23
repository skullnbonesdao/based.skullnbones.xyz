import { defineStore } from 'pinia'
import { PublicKey } from '@solana/web3.js'
import tokenList from 'stores/tokenlist/TokenList.json'
import type { cNFT } from 'stores/interfaces/cNFT'
import { searchCrewByOwner } from 'stores/interfaces/cNFTInterface'
import { getSigner } from 'components/squads/SignerFinder'
import { toTokenAccount } from 'stores/interfaces/toTokenAccount'
import { getAccounts } from 'stores/interfaces/rpc'

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

export interface TokenAccountInfo {
  name: string
  symbol: string
  key: PublicKey
  mint: PublicKey
  decimals: number
  uiAmount: number
  itemType: string
  uiAmountSelected: number
  thumbnailUrl: string
}

export const useTokenStore = defineStore('tokenStore', {
  state: () => ({
    tokenList: tokenList,
    walletTokenAccounts: undefined as TokenAccountInfo[] | undefined,
    walletCrewAccounts: undefined as cNFT[] | undefined,
  }),

  actions: {
    async updateStore(wallet: PublicKey) {
      try {
        this.walletTokenAccounts = toTokenAccount<TokenAccountInfo>(
          await getAccounts([wallet]),
        ).filter((account) => account.uiAmount > 0)

        this.walletCrewAccounts = await searchCrewByOwner(getSigner())
      } catch (err) {
        console.error(`[${this.$id}]`, err)
      } finally {
        console.log(`[${this.$id}] updated`)
      }
    },

    resetStore() {
      this.walletTokenAccounts = undefined
      this.walletCrewAccounts = undefined
    },
  },
})
