import type { AnchorWallet } from 'solana-wallets-vue'
import { Connection, PublicKey } from '@solana/web3.js'
import { AnchorProvider, Program } from '@project-serum/anchor'
import { publicKeyToAsyncSigner } from 'components/staratlas/helper'
import type { AsyncSigner } from '@staratlas/data-source'
import { POINTS_IDL, PointsIDL } from '@staratlas/points'
import {
  CRAFT_KEY,
  DATA_KEY,
  LP_KEY,
  MINE_KEY,
  PILOT_KEY,
  POINTS_PROGRAM_ID,
} from 'src/handler/constants'

export class PointsHandler {
  static readonly POINTS_PROGRAM_ID = POINTS_PROGRAM_ID
  static readonly LP_KEY = LP_KEY
  static readonly PILOT_KEY = PILOT_KEY
  static readonly DATA_KEY = DATA_KEY
  static readonly MINE_KEY = MINE_KEY
  static readonly CRAFT_KEY = CRAFT_KEY

  pointsProgram: Program<PointsIDL>

  ready: Promise<string>

  connection: Connection
  provider: AnchorProvider
  funder: AsyncSigner

  constructor(wallet: AnchorWallet, connection: Connection, signer: PublicKey) {
    this.connection = connection
    this.provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())
    this.pointsProgram = new Program(POINTS_IDL, PointsHandler.POINTS_PROGRAM_ID, this.provider)
    this.funder = publicKeyToAsyncSigner(signer)

    this.ready = Promise.all([]).then(() => {
      //TODO: Add loader info here
      return Promise.resolve('ready')
    })
  }

  async getPointsAddress(
    playerPubkey: PublicKey,
    points: 'LP' | 'Pilot' | 'Data' | 'Mine' | 'Craft',
  ) {
    return null
  }
}
