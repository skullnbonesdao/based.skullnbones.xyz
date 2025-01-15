import * as web3 from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'

import { AsyncSigner } from '@staratlas/data-source'

const LAMPORTS = 1_000_000_000

const BASE_FEE = 0

//const BASE_FEE = 0.0001 * LAMPORTS
const CRATE_FEE = 0.2 * LAMPORTS
const FEE_WALLET = new PublicKey('feeYA2tAXP7a38Dcf43Xap4CxxzAaSWZ28NT3Xpx8Hm')

export class FeeInstructionHandler {
  signer: AsyncSigner

  constructor(signer: AsyncSigner) {
    this.signer = signer
  }

  transferFeeIx(feeType: 'CREATE' | 'DEFAULT') {
    let amount = BASE_FEE
    if (feeType === 'CREATE') {
      amount = CRATE_FEE
    }

    return web3.SystemProgram.transfer({
      fromPubkey: this.signer.publicKey(),
      toPubkey: FEE_WALLET,
      lamports: amount,
    })
  }
}
