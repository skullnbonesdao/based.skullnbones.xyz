import { defineStore } from 'pinia'
import type { AccountInfo, ParsedAccountData } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'
import { useRPCStore } from 'stores/rpcStore'
import tokenList from 'stores/tokenlist/TokenList.json'
import { findCargoPodAddress } from 'src/handler/interfaces/CargoInterface'
import { useProfileStore } from 'stores/profileStore'
import { getSigner } from 'components/squads/SignerFinder'
import { cNFT } from 'stores/interfaces/cNFT'

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
    staratlasNFTs: undefined as PublicKey | undefined,
    walletTokenAccounts: undefined as TokenAccount[] | undefined,
    walletCrewAccounts: undefined as cNFT[] | undefined,
    gameTokenAccounts: undefined as TokenAccount[] | undefined,
  }),

  actions: {
    async updateStore(wallet: PublicKey) {
      try {
        this.walletTokenAccounts = toTokenAccount(await getAccounts([wallet]))

        this.gameTokenAccounts = toTokenAccount(
          await getAccounts([await findCargoPodAddress(), useProfileStore().sageProfileAddress!]),
        )

        this.walletCrewAccounts = await getCrew()
      } catch (err) {
        console.error(`[${this.$id}]`, err)
      } finally {
        console.log(`[${this.$id}] updated`)
      }
    },
    resetStore() {
      this.walletTokenAccounts = undefined
      this.gameTokenAccounts = undefined
    },
  },
})

async function getAccounts(addresses: PublicKey[]): Promise<
  {
    pubkey: PublicKey
    account: AccountInfo<Buffer | ParsedAccountData>
  }[]
> {
  const allResults = await Promise.all(
    addresses.map((address) =>
      useRPCStore().connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
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
      }),
    ),
  )

  // Flatten array-of-arrays into a single array
  return allResults.flat()
}

async function getCrew() {
  let crew: cNFT[] = []
  //const url = 'https://rpc.shyft.to?api_key=OmPgW85HNcfF-a-9'
  const url = 'https://mainnet.helius-rpc.com/?api-key=63494a33-7e60-487d-97d5-b1cc16f899a7'

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'my-id',
      method: 'searchAssets',
      params: {
        // Returning only compressed items.
        compressed: true,
        // Example wallet
        ownerAddress: getSigner().toString(),
        // Drip Haus collection ID.
        grouping: ['collection', 'CREWSAACJTKHKhZi96pLRJXsxiGbdZaQHdFW9r7qGJkB'],
        page: 1,
      },
    }),
  })
  const data = await response.json()
  if (data.result?.items) crew = data.result.items
  return crew
}

function toTokenAccount(
  data: { pubkey: PublicKey; account: AccountInfo<Buffer | ParsedAccountData> }[],
): TokenAccount[] {
  return data
    .flatMap((account) => {
      const parsedData = account.account.data as ParsedAccountData

      const mint = parsedData.parsed.info.mint.toString()

      return {
        name: tokenList.find((tl) => tl.mint == mint)?.name,
        symbol: tokenList.find((tl) => tl.mint == mint)?.symbol,
        itemType: tokenList.find((tl) => tl.mint == mint)?.itemType,
        key: new PublicKey(account.pubkey.toString()),
        mint: new PublicKey(mint),
        amount: parsedData.parsed.info.tokenAmount.amount,
        decimals: parsedData.parsed.info.tokenAmount.decimals,
        uiAmount: parsedData.parsed.info.tokenAmount.uiAmount,
        uiAmountSelected: parsedData.parsed.info.tokenAmount.uiAmount,
      } as TokenAccount
    })
    .filter((account) => account.amount > 0)
}
