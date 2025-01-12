import { defineStore } from 'pinia'
import { AccountInfo, ParsedAccountData, PublicKey } from '@solana/web3.js'
import { useRPCStore } from 'stores/rpcStore'
import tokenList from 'stores/tokenlist/TokenList.json'
import { findCargoPodAddress } from 'src/handler/interfaces/CargoInterface'

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

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
    cargoPodAddress: undefined as PublicKey | undefined,
    staratlasNFTs: undefined as PublicKey | undefined,
    walletTokenAccounts: undefined as TokenAccount[] | undefined,
    cargoPodTokenAccounts: undefined as TokenAccount[] | undefined,
  }),

  actions: {
    async updateStore(wallet: PublicKey) {
      this.wallet = wallet
      this.cargoPodAddress = await findCargoPodAddress()

      try {
        this.walletTokenAccounts = toTokenAccount(await getAccounts(this.wallet))
        this.cargoPodTokenAccounts = toTokenAccount(await getAccounts(this.cargoPodAddress))
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

async function getAccounts(address: PublicKey): Promise<
  {
    pubkey: PublicKey
    account: AccountInfo<Buffer | ParsedAccountData>
  }[]
> {
  return await useRPCStore().connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
    filters: [
      {
        dataSize: 165,
      },
      {
        memcmp: {
          offset: 32,
          bytes: address.toBase58(),
        },
      },
    ],
  })
}

function toTokenAccount(
  data: { pubkey: PublicKey; account: AccountInfo<Buffer | ParsedAccountData> }[],
): TokenAccount[] {
  return data
    .flatMap((account) => {
      const mint = account.account.data?.parsed.info.mint.toString()

      return {
        name: tokenList.find((tl) => tl.mint == mint)?.name,
        symbol: tokenList.find((tl) => tl.mint == mint)?.symbol,
        itemType: tokenList.find((tl) => tl.mint == mint)?.itemType,
        key: new PublicKey(account.pubkey.toString()),
        mint: new PublicKey(mint),
        amount: account.account.data?.parsed.info.tokenAmount.amount,
        decimals: account.account.data?.parsed.info.tokenAmount.decimals,
        uiAmount: account.account.data?.parsed.info.tokenAmount.uiAmount,
        uiAmountSelected: account.account.data?.parsed.info.tokenAmount.uiAmount,
      } as TokenAccount
    })
    .filter((account) => account.amount > 0)
}
