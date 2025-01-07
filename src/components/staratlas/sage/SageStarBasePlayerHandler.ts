import { PublicKey } from '@solana/web3.js'
import { InstructionReturn, readFromRPCOrError } from '@staratlas/data-source'
import {
  getCargoPodsByAuthority,
  MineItem,
  Planet,
  Resource,
  Sector,
  Starbase,
  StarbasePlayer,
} from '@staratlas/sage'

import type { SageGameHandler } from './SageGameHandler'
import { BN } from '@staratlas/anchor'
import { publicKeyToAsyncSigner, walletStoreToAsyncSigner } from 'components/staratlas/helper'
import { getSigner } from 'components/squads/SignerFinder'
import { useSquadsStore } from 'components/squads/SquadsStore'
import { useRPCStore } from 'stores/rpcStore'
import { useWallet } from 'solana-wallets-vue'
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@staratlas/anchor/dist/cjs/utils/token'

export class StarbasePlayerHandler {
  constructor(private _gameHandler: SageGameHandler) {}

  async ixDepositToStarBase(
    playerProfile: PublicKey,
    coordinates: [BN, BN],
  ): Promise<InstructionReturn[]> {
    const program = this._gameHandler.program
    const cargoProgram = this._gameHandler.cargoProgram
    const sagePlayerProfile = this._gameHandler.getSagePlayerProfileAddress(playerProfile)

    const starbase = this._gameHandler.getStarbaseAddress(coordinates)

    const starbaseAccount = await readFromRPCOrError(
      this._gameHandler.provider.connection,
      this._gameHandler.program,
      starbase,
      Starbase,
      'confirmed',
    )

    const starbasePlayer = this._gameHandler.getStarbasePlayerAddress(
      starbase,
      sagePlayerProfile,
      starbaseAccount.data.seqId,
    )

    const profileFaction = this._gameHandler.getProfileFactionAddress(playerProfile)

    const signer = useSquadsStore().useSquads
      ? publicKeyToAsyncSigner(getSigner())
      : walletStoreToAsyncSigner(useWallet())

    const cargoPods = await getCargoPodsByAuthority(
      useRPCStore().connection,
      this._gameHandler.cargoProgram,
      starbasePlayer,
    )
    console.log(cargoPods)
    const cargoPod = new PublicKey('CqxXqHHVYDoH4kedRhkLLC5kjKCFnUgeEqcXEWGQhs2S')

    const cargoType = new PublicKey('ammoK8AkX2wnebQb35cDAZtTkvsXQbi82cGeTnUvvfK')
    const cargoStatsDefinition = this._gameHandler.cargoStatsDefinition!

    const tokenFrom = this.findATA(cargoType, signer.publicKey())[0]
    const tokenTo = this.findATA(cargoType, cargoPod)[0]

    const gameId = this._gameHandler.gameId!
    const gameState = this._gameHandler.gameState!

    const ix = []
    ix.push(
      StarbasePlayer.depositCargoToGame(
        program,
        cargoProgram,
        starbasePlayer,
        signer,
        playerProfile,
        profileFaction,
        starbase,
        cargoPod,
        cargoType,
        cargoStatsDefinition,
        tokenFrom,
        tokenTo,
        gameId,
        gameState,
        {
          amount: new BN(1),
          keyIndex: 0,
        },
      ),
    )

    console.log(ix)
    return ix
  }

  async getMineItemAccount(mineItemPubkey: PublicKey): Promise<MineItem> {
    const mineItem = readFromRPCOrError(
      this._gameHandler.provider.connection,
      this._gameHandler.program,
      mineItemPubkey,
      MineItem,
      'confirmed',
    )

    return mineItem
  }

  async getPlanetAccount(planetPubkey: PublicKey): Promise<Planet> {
    const planet = readFromRPCOrError(
      this._gameHandler.provider.connection,
      this._gameHandler.program,
      planetPubkey,
      Planet,
      'confirmed',
    )

    return planet
  }

  async getResourceAccount(resourcePubkey: PublicKey): Promise<Resource> {
    const resource = readFromRPCOrError(
      this._gameHandler.provider.connection,
      this._gameHandler.program,
      resourcePubkey,
      Resource,
      'confirmed',
    )

    return resource
  }

  async getSectorAccount(sectorPubkey: PublicKey): Promise<Sector> {
    const sector = readFromRPCOrError(
      this._gameHandler.provider.connection,
      this._gameHandler.program,
      sectorPubkey,
      Sector,
      'confirmed',
    )

    return sector
  }

  async getStarbaseAccount(starbasePubkey: PublicKey): Promise<Starbase> {
    const starbase = readFromRPCOrError(
      this._gameHandler.provider.connection,
      this._gameHandler.program,
      starbasePubkey,
      Starbase,
      'confirmed',
    )

    return starbase
  }

  findATA(mint: PublicKey, owner: PublicKey) {
    const account = PublicKey.findProgramAddressSync(
      [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      ASSOCIATED_PROGRAM_ID,
    )
    return account
  }
}
