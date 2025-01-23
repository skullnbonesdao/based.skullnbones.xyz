import { defineStore } from 'pinia'
import type { AccountInfo, ParsedAccountData } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'
import { useRPCStore } from 'stores/rpcStore'
import tokenList from 'stores/tokenlist/TokenList.json'
import { findCargoPodAddress } from 'src/handler/interfaces/CargoInterface'
import { useProfileStore } from 'stores/profileStore'
import type { cNFT } from 'stores/interfaces/cNFT'
import { searchCrewByOwner } from 'stores/interfaces/cNFTInterface'
import { getSigner } from 'components/squads/SignerFinder'
import type { WrappedShipEscrow } from '@staratlas/sage'
import { useGameStore } from 'stores/gameStore'
import { findShipByMint } from 'src/handler/interfaces/GameInterface'

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')

export interface TokenAccount {
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

export interface StarbaseTokenAccount extends TokenAccount {
  wrappedShipEscrows: WrappedShipEscrow[]
}

export const useTokenStore = defineStore('tokenStore', {
  state: () => ({
    tokenList: tokenList,
    walletTokenAccounts: undefined as TokenAccount[] | undefined,
    gameTokenAccounts: undefined as StarbaseTokenAccount[] | undefined,
    gameTokenAccountsSelected: undefined as StarbaseTokenAccount | undefined,

    walletCrewAccounts: undefined as cNFT[] | undefined,
    gameCrewAccounts: undefined as cNFT[] | undefined,

    fleetCargoAccounts: [] as TokenAccount[] | undefined,
  }),

  actions: {
    async updateStore(wallet: PublicKey) {
      try {
        this.walletTokenAccounts = toTokenAccount<TokenAccount>(await getAccounts([wallet])).filter(
          (account) => account.uiAmount > 0,
        )

        this.gameTokenAccounts = toTokenAccount<StarbaseTokenAccount>(
          await getAccounts([await findCargoPodAddress(), useProfileStore().sageProfileAddress!]),
        )
          .map((gTA: StarbaseTokenAccount) => {
            if (gTA.itemType == 'ship') {
              const data = gTA

              data.wrappedShipEscrows =
                useGameStore().starbasePlayer?.wrappedShipEscrows.filter(
                  (wSE) => wSE.ship.toString() == findShipByMint(gTA.mint)?.toString(),
                ) ?? []
              data.uiAmount = data.wrappedShipEscrows.reduce(
                (sum, item) => sum + item.amount.toNumber(),
                0,
              )
              data.uiAmountSelected = data.uiAmount

              return data
            } else return gTA
          })
          .filter((account) => account.uiAmount > 0)

        this.walletCrewAccounts = await searchCrewByOwner(getSigner())
        this.gameCrewAccounts = await searchCrewByOwner(useProfileStore().sageProfileAddress!)
      } catch (err) {
        console.error(`[${this.$id}]`, err)
      } finally {
        console.log(`[${this.$id}] updated`)
      }
    },

    async updateFleetCargoAccounts(fleet: PublicKey) {
      try {
        const cargoHold = useGameStore().fleets?.find((f) => f.key.toString() == fleet.toString())
          ?.data.cargoHold

        if (cargoHold)
          this.fleetCargoAccounts = toTokenAccount<TokenAccount>(await getAccounts([cargoHold!]))
      } catch (error) {
        console.error(`[${this.$id}] waring:`, error)
      } finally {
        console.log(`[${this.$id}] updated fleet cargo accounts`)
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
        commitment: 'confirmed',
      }),
    ),
  )

  // Flatten array-of-arrays into a single array
  return allResults.flat()
}

function toTokenAccount<T>(
  data: { pubkey: PublicKey; account: AccountInfo<Buffer | ParsedAccountData> }[],
): T[] {
  return data.flatMap((account) => {
    const parsedData = account.account.data as ParsedAccountData

    const mint = parsedData.parsed.info.mint.toString()

    return {
      name: tokenList.find((tl) => tl.mint == mint)?.name,
      symbol: tokenList.find((tl) => tl.mint == mint)?.symbol,
      itemType: tokenList.find((tl) => tl.mint == mint)?.itemType,
      thumbnailUrl: tokenList.find((tl) => tl.mint == mint)?.thumbnailUrl,

      key: new PublicKey(account.pubkey.toString()),
      mint: new PublicKey(mint),

      decimals: parsedData.parsed.info.tokenAmount.decimals,
      uiAmount: parsedData.parsed.info.tokenAmount.uiAmount,
      uiAmountSelected: parsedData.parsed.info.tokenAmount.uiAmount,
    } as T
  })
}
