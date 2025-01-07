import type { PublicKey } from '@solana/web3.js'
import type { AsyncSigner } from '@staratlas/data-source'
import type { PublicKey as UmiPublicKey } from '@metaplex-foundation/umi-public-keys/dist/types/common'

export interface SageGameShip {
  [key: string]: PublicKey[]
}

export interface SageGameSector {
  sector: PublicKey
  starbases: PublicKey[]
  planets: PublicKey[]
  starbasePlayers: SageGameStarbasePlayer[]
}

export interface SageGameProfile {
  key: AsyncSigner
  profile: PublicKey
  index: number
}

export interface SageGameProfiles {
  superuser: SageGameProfile
  player1: SageGameProfile
  others: Array<SageGameProfile>
}

export interface SageGameStarbasePlayer {
  starbasePlayer: PublicKey
  cargoPod: PublicKey
}

export interface SageGameRecipes {
  category: PublicKey
  recipes: PublicKey[]
}

export interface PointsCategories {
  miningXpCategory: PublicKey
  pilotXpCategory: PublicKey
  dataRunningXpCategory: PublicKey
  craftingXpCategory: PublicKey
  lpCategory: PublicKey
  councilRankXpCategory: PublicKey
}

export interface SageGameCrewConfig {
  crewProgramConfig: PublicKey
  sageCrewConfig: PublicKey
  crewMerkleTree: PublicKey
  knownLeaves: UmiPublicKey[]
}
