import { defineStore } from 'pinia'
import { PublicKey } from '@solana/web3.js'
import {
  findFactionProfileAddress,
  findProfileNameAddress,
  loadFactionProfile,
  loadPlayerName,
  loadPlayerProfile,
  loadPlayerProfileAddress,
} from 'src/handler/interfaces/ProfileInterface'
import type { PlayerName, PlayerProfile } from '@staratlas/player-profile'
import type { ProfileFactionAccount } from '@staratlas/profile-faction'
import type { SagePlayerProfile } from '@staratlas/sage/src'
import { findSageProfileAddress, loadSageProfile } from 'src/handler/interfaces/SageInterface'
import {
  findPointsAddress,
  loadPoints,
  PointsCategoryEnum,
} from 'src/handler/interfaces/PointsInterface'
import type { UserPoints } from '@staratlas/points'
import { getPointsCategoryEnumString } from 'src/handler/convert/EnumToString'
import { useGameStore } from 'stores/gameStore'

export interface IPoints {
  category: PointsCategoryEnum
  address: PublicKey | undefined
  points: UserPoints | undefined
}

export const useProfileStore = defineStore('profileStore', {
  state: () => ({
    wallet: undefined as PublicKey | undefined,
    gameID: new PublicKey('GAMEzqJehF8yAnKiTARUuhZMvLvkZVAsCVri5vSfemLr'),
    playerProfileAddress: undefined as PublicKey | undefined,
    nameProfileAddress: undefined as PublicKey | undefined,
    factionProfileAddress: undefined as PublicKey | undefined,
    sageProfileAddress: undefined as PublicKey | undefined,

    pointsLPAddress: undefined as PublicKey | undefined,
    pointsPILOTAddress: undefined as PublicKey | undefined,
    pointsDATAAddress: undefined as PublicKey | undefined,
    pointsMINEAddress: undefined as PublicKey | undefined,
    pointsCRAFTAddress: undefined as PublicKey | undefined,

    playerProfile: undefined as PlayerProfile | undefined,
    nameProfile: undefined as PlayerName | undefined,
    factionProfile: undefined as ProfileFactionAccount | undefined,
    sageProfile: undefined as SagePlayerProfile | undefined,

    points: [
      {
        category: PointsCategoryEnum.LP,
        address: undefined,
        points: undefined,
      },
      {
        category: PointsCategoryEnum.PILOT,
        address: undefined,
        points: undefined,
      },
      {
        category: PointsCategoryEnum.DATA,
        address: undefined,
        points: undefined,
      },
      {
        category: PointsCategoryEnum.MINE,
        address: undefined,
        points: undefined,
      },
      {
        category: PointsCategoryEnum.CRAFT,
        address: undefined,
        points: undefined,
      },
    ] as IPoints[],
  }),

  actions: {
    async updateStore(wallet: PublicKey) {
      try {
        this.wallet = wallet
        this.resetStore()

        this.playerProfileAddress = await loadPlayerProfileAddress(this.wallet)
        if (this.playerProfileAddress) {
          this.nameProfileAddress = findProfileNameAddress(this.playerProfileAddress)
          this.factionProfileAddress = findFactionProfileAddress(this.playerProfileAddress)
          this.sageProfileAddress = findSageProfileAddress(
            this.playerProfileAddress,
            useGameStore().gameID,
          )

          this.points.map(
            (point) =>
              (point.address = findPointsAddress(this.playerProfileAddress!, point.category)),
          )

          this.playerProfile = await loadPlayerProfile(this.playerProfileAddress).catch(() => {
            console.warn(`[${this.$id}] player profile does not exist!`)
            return undefined
          })

          this.nameProfile = await loadPlayerName(this.nameProfileAddress).catch(() => {
            console.warn(`[${this.$id}] name profile does not exist!`)
            return undefined
          })

          this.factionProfile = await loadFactionProfile(this.factionProfileAddress).catch(() => {
            console.warn(`[${this.$id}] faction profile does not exist!`)
            return undefined
          })

          this.sageProfile = await loadSageProfile(this.sageProfileAddress).catch(() => {
            console.warn(`[${this.$id}] sage profile does not exist!`)
            return undefined
          })

          this.points.map(async (point) => {
            point.points = await loadPoints(point.address!).catch(() => {
              console.warn(
                `[${this.$id}] points profile ${getPointsCategoryEnumString(point.category)} does not exist!`,
              )
              return undefined
            })
          })
        }
      } catch (err) {
        console.error(`[${this.$id}]`, err)
      } finally {
        console.log(`[${this.$id}] updated`)
      }
    },
    resetStore() {
      this.playerProfileAddress = undefined
      this.nameProfileAddress = undefined
      this.factionProfileAddress = undefined
      this.sageProfileAddress = undefined
      this.pointsLPAddress = undefined
      this.pointsPILOTAddress = undefined
      this.pointsDATAAddress = undefined
      this.pointsMINEAddress = undefined
      this.pointsCRAFTAddress = undefined

      this.playerProfile = undefined
      this.nameProfile = undefined
      this.factionProfile = undefined
      this.sageProfile = undefined
      this.points.map((point) => {
        point.address = undefined
        point.points = undefined
      })
    },
  },
})
