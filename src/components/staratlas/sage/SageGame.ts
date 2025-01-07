import { SAGE_IDL, SageIDLProgram, SagePlayerProfile, StarbasePlayer } from '@staratlas/sage/src'
import { AnchorProvider, BN, Program } from '@staratlas/anchor'
import type { PlayerProfileIDL } from '@staratlas/player-profile'
import { PLAYER_PROFILE_IDL } from '@staratlas/player-profile'
import type { ProfileFactionIDL } from '@staratlas/profile-faction'
import { PROFILE_FACTION_IDL, ProfileFactionAccount } from '@staratlas/profile-faction'
import { CARGO_IDL, CargoIDLProgram, CargoPod, CargoType } from '@staratlas/cargo'
import type { CraftingIDLProgram } from '@staratlas/crafting'
import { CRAFTING_IDL } from '@staratlas/crafting'
import type { CrewIDLProgram } from '@staratlas/crew'
import { CREW_IDL } from '@staratlas/crew'
import type { PointsIDLProgram } from '@staratlas/points'
import { POINTS_IDL } from '@staratlas/points'
import type { PointsStoreIDLProgram } from '@staratlas/points-store'
import { POINTS_STORE_IDL } from '@staratlas/points-store'
import type { AddressLookupTableAccount, Connection, Keypair } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'
import {
  AsyncSigner,
  createAssociatedTokenAccountIdempotent,
  InstructionReturn,
  keypairToAsyncSigner,
  mintToTokenAccount,
  readAllFromRPC,
} from '@staratlas/data-source'
import { useAnchorWallet } from 'solana-wallets-vue'
import { usePlayerProfileStore } from 'stores/player-profile-store'
import {
  PointsCategories,
  SageGameCrewConfig,
  SageGameProfiles,
  SageGameRecipes,
  SageGameSector,
  SageGameShip,
} from 'components/staratlas/sage/types'
import { useWorkspaceAdapter } from 'components/staratlas/connector'
import { useRPCStore } from 'stores/rpcStore'
import { Sector } from '@staratlas/sage'
import { useStarbaseStore } from 'stores/starbase-store'

export class SageGame {
  static readonly GAME_ID = 'GAMEzqJehF8yAnKiTARUuhZMvLvkZVAsCVri5vSfemLr'

  static readonly SAGE_PROGRAM_ID = 'SaGeXGRK85wYGfDqnVDw2bZ61hpdYPFLn1HiRdnRhoC'
  static readonly PLAYER_PROFILE_PROGRAM_ID = 'PprofUW1pURCnMW2si88GWPXEEK3Bvh9Tksy8WtnoYJ'
  static readonly PROFILE_FACTION_PROGRAM_ID = 'pFACzkX2eSpAjDyEohD6i3VRJvREtH9ynbtM1DwVFsj'
  static readonly CARGO_PROGRAM_ID = 'CArGoi989iv3VL3xArrJXmYYDNhjwCX5ey5sY5KKwMG'
  static readonly CRAFTING_PROGRAM_ID = 'CRAFtUSjCW74gQtCS6LyJH33rhhVhdPhZxbPegE4Qwfq'
  static readonly CREW_PROGRAM_ID = 'CrewCfY4Na9HBj7UAJ9Yi9AteoEYPhEs8sg6YnjK4qBL'
  static readonly POINTS_PROGRAM_ID = 'PointJfvuHi8DgGsPCy97EaZkQ6NvpghAAVkuquLf3w'
  static readonly POINTS_STORE_PROGRAM_ID = 'PsTRqmfqtLcXcGQoguTLAppxq1rnuTqqyUMRoY62XL1'
  static readonly MARKET_HOOK_PROGRAM_ID = 'hooKwBRKyzBqxVZFQVpLMKGexhmc6ZNaRAbwWi8uMok'

  static readonly ATLAS = 'ATLAS'
  static readonly POLIS = 'POLIS'

  static readonly SDU = 'SDU'

  static readonly FOOD = 'FOOD'
  static readonly AMMO = 'AMMO'
  static readonly FUEL = 'FUEL'
  static readonly REPAIR_KIT = 'REPAIR_KIT'
  static readonly RESOURCES = [this.FOOD, this.AMMO, this.FUEL, this.REPAIR_KIT]

  ready: Promise<string>

  program: SageIDLProgram
  playerProfileProgram: Program<PlayerProfileIDL>
  profileFactionProgram: Program<ProfileFactionIDL>
  cargoProgram: CargoIDLProgram
  craftingProgram: CraftingIDLProgram
  crewProgram: CrewIDLProgram
  pointsProgram: PointsIDLProgram
  pointsStoreProgram: PointsStoreIDLProgram
  connection: Connection
  provider: AnchorProvider

  profiles: SageGameProfiles
  funder: AsyncSigner

  gameId: PublicKey
  gameState?: PublicKey
  cargoStatsDefinition?: PublicKey
  craftingDomain?: PublicKey
  sagePlayerProfile?: PublicKey
  ships?: SageGameShip
  sectors?: SageGameSector[]
  fleets?: PublicKey[]
  recipes?: SageGameRecipes[]
  mints?: { [key: string]: PublicKey }
  pointCategories?: PointsCategories
  crew?: SageGameCrewConfig
  lookupTables?: AddressLookupTableAccount[]

  constructor(funder: Keypair, connection: Connection) {
    this.connection = connection

    const wallet = useAnchorWallet()

    this.provider = new AnchorProvider(connection, wallet!, AnchorProvider.defaultOptions())

    this.gameState = new PublicKey('DeXGvdhyVUMSbmGWZtwFm5NM3q3TmRDKaAF3KgGx3dBJ')

    this.program = new Program(SAGE_IDL, new PublicKey(SageGame.SAGE_PROGRAM_ID), this.provider)
    this.cargoProgram = new Program(
      CARGO_IDL,
      new PublicKey(SageGame.CARGO_PROGRAM_ID),
      this.provider,
    )
    this.craftingProgram = new Program(
      CRAFTING_IDL,
      new PublicKey(SageGame.CRAFTING_PROGRAM_ID),
      this.provider,
    )
    this.crewProgram = new Program(CREW_IDL, new PublicKey(SageGame.CREW_PROGRAM_ID), this.provider)
    this.playerProfileProgram = new Program(
      PLAYER_PROFILE_IDL,
      new PublicKey(SageGame.PLAYER_PROFILE_PROGRAM_ID),
      this.provider,
    )
    this.profileFactionProgram = new Program(
      PROFILE_FACTION_IDL,
      new PublicKey(SageGame.PROFILE_FACTION_PROGRAM_ID),
      this.provider,
    )
    this.pointsProgram = new Program(
      POINTS_IDL,
      new PublicKey(SageGame.POINTS_PROGRAM_ID),
      this.provider,
    )
    this.pointsStoreProgram = new Program(
      POINTS_STORE_IDL,
      new PublicKey(SageGame.POINTS_STORE_PROGRAM_ID),
      this.provider,
    )

    this.funder = keypairToAsyncSigner(funder)
    this.gameId = new PublicKey(SageGame.GAME_ID)
  }

  async initalize() {
    this.gameState = new PublicKey('DeXGvdhyVUMSbmGWZtwFm5NM3q3TmRDKaAF3KgGx3dBJ')
    this.sagePlayerProfile = SagePlayerProfile.findAddress(
      this.program,
      usePlayerProfileStore().playerProfile!.key,
      this.gameId,
    )[0]
    this.cargoStatsDefinition = new PublicKey('CSTatsVpHbvZmwHbCjZKVfYQT5JXfsXccXufhEcwCqTg')

    console.log(
      await readAllFromRPC(
        useRPCStore().connection,
        useWorkspaceAdapter()!.cargoProgram.value!,
        CargoPod,
      ),
    )

    this.sectors = []

    const starbasePlayerKey = StarbasePlayer.findAddress(
      useWorkspaceAdapter()?.sageProgram.value!,
      useStarbaseStore().starbase?.key!,
      this.sagePlayerProfile,
      0,
    )[0]
    console.log(starbasePlayerKey)

    await readAllFromRPC(
      useRPCStore().connection,
      useWorkspaceAdapter()?.sageProgram.value!,
      Sector,
    ).then((data) => {
      data.map((d) => {
        if (d.type !== 'ok') {
          const sbpData = {
            starbasePlayer: starbasePlayerKey,
            cargoPod: null,
          }

          this.sectors?.push({
            sector: d.data.key,

            planets: [],
            starbases: [],
            starbasePlayers: [],
          })
        }
      })
    })

    console.log(this.sectors)
  }

  getProfileFactionAddress(profile: PublicKey) {
    return ProfileFactionAccount.findAddress(this.profileFactionProgram, profile)[0]
  }

  getCargoTypeAddress(mint: PublicKey) {
    if (!this.cargoStatsDefinition) {
      throw 'this.cargoStatsDefinition not set'
    }
    return CargoType.findAddress(this.cargoProgram, this.cargoStatsDefinition, mint, 0)[0]
  }

  getStarbasePlayer(starbasePlayer: PublicKey) {
    if (!this.sectors) {
      throw 'this.sectors not set'
    }
    const thisSBPData = this.sectors
      .map((it) => it.starbasePlayers)
      .flat()
      .find((it) => it.starbasePlayer.equals(starbasePlayer))
    if (!thisSBPData) {
      throw 'starbasePlayer not found'
    }
    return thisSBPData
  }

  addCargoToGameInstructions(
    starbase: PublicKey,
    starbasePlayer: PublicKey,
    mint: PublicKey,
    amount: number,
    starbasePlayerCargoPod?: PublicKey,
  ) {
    if (!this.gameState) {
      throw 'this.gameState not set'
    }
    if (!this.sagePlayerProfile) {
      throw 'this.sagePlayerProfile not set'
    }
    if (!this.cargoStatsDefinition) {
      throw 'this.cargoStatsDefinition not set'
    }
    const thisSBPData = this.getStarbasePlayer(starbasePlayer)
    const tokenFrom = createAssociatedTokenAccountIdempotent(
      mint,
      this.profiles.player1.key.publicKey(),
      true,
    )
    const destinationPod = starbasePlayerCargoPod || thisSBPData.cargoPod
    const tokenTo = createAssociatedTokenAccountIdempotent(mint, destinationPod, true)

    const instructions: InstructionReturn[] = [tokenFrom.instructions, tokenTo.instructions]

    instructions.push(
      mintToTokenAccount(this.profiles.superuser.key, mint, tokenFrom.address, amount),
    )
    instructions.push(
      StarbasePlayer.depositCargoToGame(
        this.program,
        this.cargoProgram,
        starbasePlayer,
        this.profiles.player1.key,
        this.profiles.player1.profile,
        this.getProfileFactionAddress(this.profiles.player1.profile),
        starbase,
        destinationPod,
        this.getCargoTypeAddress(mint),
        this.cargoStatsDefinition,
        tokenFrom.address,
        tokenTo.address,
        this.gameId,
        this.gameState,
        {
          amount: new BN(amount),
          keyIndex: this.profiles.player1.index,
        },
      ),
    )
    return instructions
  }
}
