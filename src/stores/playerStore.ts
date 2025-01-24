import { defineStore } from 'pinia'
import type { Starbase, StarbasePlayer, WrappedShipEscrow } from '@staratlas/sage'
import {
  findShipByMint,
  loadFleets,
  loadStarbasePlayer,
} from 'src/handler/interfaces/GameInterface'
import type { Fleet } from '@staratlas/sage/src'
import type { TokenAccountInfo } from 'stores/tokenStore'
import type { cNFT } from 'stores/interfaces/cNFT'
import { toTokenAccount } from 'stores/interfaces/toTokenAccount'
import { getAccounts } from 'stores/interfaces/rpc'
import { findCargoPodAddress } from 'src/handler/interfaces/CargoInterface'
import { useProfileStore } from 'stores/profileStore'
import { searchCrewByOwner } from 'stores/interfaces/cNFTInterface'
import type { PublicKey } from '@solana/web3.js'

const STORE_NAME = 'playerStore'

export interface StarbaseTokenAccount extends TokenAccountInfo {
  wrappedShipEscrows: WrappedShipEscrow[]
}

export interface FleetCargoAccount extends TokenAccountInfo {
  uiAmountChange: number
}

export const usePlayerStore = defineStore(STORE_NAME, {
  state: () => ({
    currentStarbase: undefined as Starbase | undefined,
    fleets: [] as Fleet[] | undefined,
    starbasePlayer: undefined as StarbasePlayer | undefined,

    starbaseTokenAccounts: undefined as StarbaseTokenAccount[] | undefined,
    starbaseTokenAccountsSelected: undefined as StarbaseTokenAccount | undefined,
    starbaseCrewAccounts: undefined as cNFT[] | undefined,
    starbaseCrewAccountsSelected: undefined as cNFT[] | undefined,

    fleetCargoAccounts: [] as FleetCargoAccount[] | undefined,
    fleetFuelAccount: undefined as FleetCargoAccount | undefined,
    fleetAmmoAccount: undefined as FleetCargoAccount | undefined,

    fleetFilteredConsumptionAccounts: [] as FleetCargoAccount[] | undefined,
    fleetFilteredCargoAccounts: [] as FleetCargoAccount[] | undefined,
  }),

  actions: {
    async updateStore() {
      try {
        this.starbaseTokenAccounts = toTokenAccount<StarbaseTokenAccount>(
          await getAccounts([await findCargoPodAddress(), useProfileStore().sageProfileAddress!]),
        )
          .map((gTA: StarbaseTokenAccount) => {
            if (gTA.itemType == 'ship') {
              const data = gTA

              data.wrappedShipEscrows =
                this.starbasePlayer?.wrappedShipEscrows.filter(
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

        this.starbaseCrewAccounts = await searchCrewByOwner(useProfileStore().sageProfileAddress!)

        await this.updateFleet()
      } catch (error) {
        console.error(`[${this.$id}] waring:`, error)
      } finally {
        console.log(`[${this.$id}] updated`)
      }
    },

    async updateFleet() {
      try {
        this.fleets = await loadFleets()
      } catch (error) {
        console.error(`[${this.$id}] waring:`, error)
      } finally {
        console.log(`[${this.$id}] updated fleet`)
      }
    },

    async updateFleetCargoAccounts(fleet: PublicKey) {
      try {
        const fuelTank = usePlayerStore().fleets?.find((f) => f.key.toString() == fleet.toString())
          ?.data.fuelTank

        if (fuelTank)
          this.fleetFuelAccount = toTokenAccount<FleetCargoAccount>(
            await getAccounts([fuelTank!]),
          )[0]

        const ammoBank = usePlayerStore().fleets?.find((f) => f.key.toString() == fleet.toString())
          ?.data.ammoBank

        if (ammoBank)
          this.fleetAmmoAccount = toTokenAccount<FleetCargoAccount>(
            await getAccounts([ammoBank!]),
          )[0]

        const cargoHold = usePlayerStore().fleets?.find((f) => f.key.toString() == fleet.toString())
          ?.data.cargoHold

        if (cargoHold)
          this.fleetCargoAccounts = toTokenAccount<FleetCargoAccount>(
            await getAccounts([cargoHold!]),
          )

        this.fleetFilteredConsumptionAccounts = [
          ...(usePlayerStore().fleetCargoAccounts || []),
          ...(usePlayerStore()
            .starbaseTokenAccounts?.filter((sTA) => sTA.itemType == 'resource')
            .filter(
              (sTA) =>
                !usePlayerStore().fleetCargoAccounts?.some(
                  (fCA) => fCA.mint.toString() == sTA.mint.toString(),
                ),
            )
            ?.map((sTA) => {
              return {
                ...sTA,
                uiAmount: 0,
              }
            }) || []),
        ].filter((acc) => ['FUEL', 'AMMO'].includes(acc.symbol))

        this.fleetFilteredCargoAccounts = [
          ...(usePlayerStore().fleetCargoAccounts || []),
          ...(usePlayerStore()
            .starbaseTokenAccounts?.filter((sTA) => sTA.itemType == 'resource')
            .filter(
              (sTA) =>
                !usePlayerStore().fleetCargoAccounts?.some(
                  (fCA) => fCA.mint.toString() == sTA.mint.toString(),
                ),
            )
            ?.map((sTA) => {
              return {
                ...sTA,
                uiAmount: 0,
              }
            }) || []),
        ].filter((acc) => !['FUEL', 'AMMO'].includes(acc.symbol))
      } catch (error) {
        console.error(`[${this.$id}] waring:`, error)
      } finally {
        console.log(`[${this.$id}] updated fleet cargo accounts`)
      }
    },
    async updateStarbasePlayer() {
      try {
        this.starbasePlayer = await loadStarbasePlayer()
      } catch (error) {
        console.error(`[${this.$id}] waring:`, error)
      } finally {
        console.log(`[${this.$id}] updated starbase player`)
      }
    },
  },
})
