import * as web3 from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'

import type { AsyncSigner } from '@staratlas/data-source'

const LAMPORTS = 1_000_000_000

const BASE_FEE = 0

//const BASE_FEE = 0.0001 * LAMPORTS
const CRATE_FEE = 0 //1 * LAMPORTS
const FEE_WALLET = new PublicKey('feeYA2tAXP7a38Dcf43Xap4CxxzAaSWZ28NT3Xpx8Hm')

export enum FEE_TYPES {
  'DEFAULT_FEE',
  'CREATE_FEE',
}

export class FeeInstructionHandler {
  signer: AsyncSigner

  constructor(signer: AsyncSigner) {
    this.signer = signer
  }

  transferFeeIx(feeType: FEE_TYPES) {
    let amount = BASE_FEE
    if (feeType === FEE_TYPES.CREATE_FEE) {
      amount = CRATE_FEE
    }

    return web3.SystemProgram.transfer({
      fromPubkey: this.signer.publicKey(),
      toPubkey: FEE_WALLET,
      lamports: amount,
    })
  }
}
