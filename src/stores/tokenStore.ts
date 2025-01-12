import { defineStore } from 'pinia'
import { PublicKey } from '@solana/web3.js'
import { useRPCStore } from 'stores/rpcStore'
import tokenList from 'stores/tokenlist/TokenList.json'

export interface TokenAccount {
  name: string
  symbol: string
  key: PublicKey
  mint: PublicKey
  amount: number
  decimals: number
  uiAmount: number
  itemType: string
  uiAmountSelected: number
}

export const useTokenStore = defineStore('tokenStore', {
  state: () => ({
    wallet: undefined as PublicKey | undefined,
    staratlasNFTs: undefined as PublicKey | undefined,
    walletTokenAccounts: undefined as TokenAccount[] | undefined,
  }),

  actions: {
    async updateStore(wallet: PublicKey) {
      this.wallet = wallet

      try {
        tokenList.forEach((token) => {})

        const tempAccounts = await useRPCStore().connection.getParsedProgramAccounts(
          new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
          {
            filters: [
              {
                dataSize: 165,
              },
              {
                memcmp: {
                  offset: 32,
                  bytes: this.wallet.toBase58(),
                },
              },
            ],
          },
        )
        this.walletTokenAccounts = tempAccounts
          .flatMap((account) => {
            const mint = account.account.data.parsed.info.mint.toString()

            return {
              name: tokenList.find((tl) => tl.mint == mint)?.name,
              symbol: tokenList.find((tl) => tl.mint == mint)?.symbol,
              itemType: tokenList.find((tl) => tl.mint == mint)?.itemType,
              key: new PublicKey(account.pubkey.toString()),
              mint: new PublicKey(mint),
              amount: account.account.data.parsed.info.tokenAmount.amount,
              decimals: account.account.data.parsed.info.tokenAmount.decimals,
              uiAmount: account.account.data.parsed.info.tokenAmount.uiAmount,
              uiAmountSelected: 0,
            } as TokenAccount
          })
          .filter((account) => account.amount > 0)
      } catch (err) {
        console.error(`[${this.$id}]`, err)
      } finally {
        console.log(`[${this.$id}] updated`)
      }
    },
    resetStore() {
      this.wallet = undefined
    },
  },
})
