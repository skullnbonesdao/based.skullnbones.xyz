export interface StarAtlasNFTAPI {
  _id: string
  deactivated: boolean
  name: string
  description: string
  image: string
  media: Media
  attributes: Attributes
  symbol: string
  markets?: Market[]
  totalSupply?: number
  mint: string
  network?: Network
  tradeSettings: TradeSettings
  airdrops?: Airdrop[]
  primarySales: PrimarySale[]
  updatedAt?: Date
  collection?: Collection
  slots?: Slots
  createdAt?: Date
  __v?: number
  tradeBlocked?: boolean
  needsUpdate?: boolean
}

export interface Airdrop {
  _id: string
  supply: number
  id: number
}

export interface Attributes {
  itemType: ItemType
  tier?: number
  class: string
  category?: string
  score?: number
  rarity: Rarity
  musician?: string
  spec?: string
  make?: string
  model?: string
  unitLength?: number
  unitWidth?: number
  unitHeight?: number
  seriesName?: SeriesName
  episode?: number
  edition?: Edition
  assetType?: string
}

export enum Edition {
  AlternateCover = 'alternate-cover',
  MagicEden = 'magic-eden',
  StarAtlas = 'star-atlas',
}

export enum ItemType {
  Access = 'access',
  Collectible = 'collectible',
  Crew = 'crew',
  Currency = 'currency',
  Memories = 'memories',
  Resource = 'resource',
  Ship = 'ship',
  ShipParts = 'ship parts',
  Story = 'story',
  Structure = 'structure',
}

export enum Rarity {
  Anomaly = 'anomaly',
  Common = 'common',
  Epic = 'epic',
  Gold = 'gold',
  Legendary = 'legendary',
  Platinum = 'platinum',
  Rare = 'rare',
  Silver = 'silver',
  Uncommon = 'uncommon',
}

export enum SeriesName {
  Core = 'core',
}

export interface Collection {
  name: string
  family: Family
}

export enum Family {
  Honeyland = 'Honeyland',
  StarAtlas = 'Star Atlas',
  SuperphoenixDAO = 'Superphoenix DAO',
}

export interface Market {
  _id?: string
  id: string
  quotePair: ExclusiveCurrency
  serumProgramId?: SerumProgramID
}

export enum ExclusiveCurrency {
  Atlas = 'ATLAS',
  Sol = 'SOL',
  Usdc = 'USDC',
}

export enum SerumProgramID {
  Srmv4UTCPF81HWDaPyEN2MLZ8XbvzuEM6LsAxR8NpjU = 'srmv4uTCPF81hWDaPyEN2mLZ8XbvzuEM6LsAxR8NpjU',
  The9XQeWvG816BUx9EPjHMAT23YvVM2ZWbrrpZb9PusVFin = '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin',
}

export interface Media {
  qrInstagram?: string
  qrFacebook?: string
  sketchfab?: string
  audio?: string
  thumbnailUrl?: string
  gallery?: string[] | null
}

export enum Network {
  Devnet = 'devnet',
  MainnetBeta = 'mainnet-beta',
}

export interface PrimarySale {
  listTimestamp: number
  _id?: string
  supply?: number
  price?: number
  isMinted?: boolean
  isListed?: boolean
  mintTimestamp?: number | null
  orderId?: null
  expireTimestamp?: number
  targetPair?: ExclusiveCurrency
  quotePrice?: number
}

export interface Slots {
  crewSlots?: ComponentSlotElement[] | null
  componentSlots?: ComponentSlotElement[] | null
  moduleSlots?: ComponentSlotElement[] | null
  interiorSlots?: InteriorSlotElement[]
  stationSlots?: InteriorSlotElement[]
}

export interface ComponentSlotElement {
  type: string
  size?: Size
  quantity: number
  crew?: ItemType
}

export enum Size {
  Capital = 'capital',
  Class8 = 'class 8',
  Commander = 'commander',
  Crew = 'crew',
  Large = 'large',
  Medium = 'medium',
  SizeClass8 = 'Class 8',
  Small = 'small',
  Titan = 'titan',
  XSmall = 'x-small',
  XXSmall = 'XX-Small',
  XxSmall = 'xx-small',
  XxxSmall = 'xxx-small',
}

export interface InteriorSlotElement {
  type: Type
}

export enum Type {
  ComingSoon = 'Coming Soon',
}

export interface TradeSettings {
  expireTime?: number | string
  saleTime?: number | string
  msrp?: Msrp
  exclusiveCurrency?: ExclusiveCurrency
  saleType?: string
  limited?: string
  vwap?: number
  secondaryMarketOcclusion?: boolean
}

export interface Msrp {
  value: number
  currencySymbol: ExclusiveCurrency
}
