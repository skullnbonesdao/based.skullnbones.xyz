import type { PublicKey, Transaction } from '@solana/web3.js'
import type { WalletStore } from 'solana-wallets-vue/dist/types'
import type { AsyncSigner, InstructionWithSigners } from '@staratlas/data-source'

export function publicKeyToAsyncSigner(key: PublicKey): AsyncSigner<WalletStore> {
  return {
    publicKey: () => key,
  } as never
}

export function walletStoreToAsyncSigner(wallet: WalletStore): AsyncSigner<WalletStore> {
  return {
    inner(): WalletStore {
      return wallet
    },
    publicKey(): PublicKey {
      return wallet.publicKey.value!
    },
    requiresAsync(): boolean {
      return true
    },
    sign<T extends Transaction>(tx: T): Promise<T> {
      return wallet.signTransaction.value!(tx)
    },
    signAll<T extends Transaction>(txs: T[]): Promise<T[]> {
      return wallet.signAllTransactions.value!(txs)
    },
  }
}

export function addStaratlasTransactionToTransaction(
  staratlasTransaction: InstructionWithSigners | InstructionWithSigners[],
  tx: Transaction,
) {
  if (Array.isArray(staratlasTransaction)) {
    staratlasTransaction.forEach((instructionWithSigners) => {
      if (instructionWithSigners?.instruction) {
        tx.add(instructionWithSigners.instruction)
        //tx.setSigners(instructionWithSigners.signers)
      } else {
        console.error('No instruction found in the array element')
      }
    })
  } else if (staratlasTransaction?.instruction) {
    tx.add(staratlasTransaction.instruction)
  } else {
    console.error('No instruction found')
  }
}
