import type { AnchorWallet } from 'solana-wallets-vue'
import { Connection, PublicKey } from '@solana/web3.js'
import { AnchorProvider, Program } from '@project-serum/anchor'
import { AsyncSigner } from '@staratlas/data-source'
import { Game, SAGE_IDL, SageIDLProgram } from '@staratlas/sage'
import { publicKeyToAsyncSigner } from 'components/staratlas/helper'

export class SageHandler {
  static readonly SAGE_PROGRAM_ID = 'SAGEqqFewepDHH6hMDcmWy7yjHPpyKLDnRXKb3Ki8e6'
  static readonly CARGO_PROGRAM_ID = 'Cargo8a1e6NkGyrjy4BQEW4ASGKs9KSyDyUrXMfpJoiH'

  ready: Promise<string>

  sageProgram: SageIDLProgram
  signer: AsyncSigner
  game?: Game
  private connection: Connection
  private provider: AnchorProvider

  constructor(anchorWallet: AnchorWallet, connection: Connection, signer: PublicKey) {
    this.connection = connection
    this.provider = new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions())
    this.sageProgram = new Program(SAGE_IDL, SageHandler.SAGE_PROGRAM_ID, this.provider)

    this.signer = publicKeyToAsyncSigner(signer)

    this.ready = Promise.all([]).then(() => {
      return Promise.resolve('ready')
    })
  }

  getGame(): Game {
    if (this.game) throw Error('game not defined')
    return this.game as never as Game
  }
}
