import type { Keypair, Transaction } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'
import type { WalletStore } from 'solana-wallets-vue/dist/types'
import type { AsyncSigner, InstructionReturn, InstructionWithSigners } from '@staratlas/data-source'
import { buildAndSignTransaction } from '@staratlas/data-source'
import { err, ok } from 'neverthrow'
import {
  isVersionedTransaction,
  verifySignatures,
} from '@staratlas/data-source/src/transactions/transactionHandling'
import { Notify } from 'quasar'
import { useSquadsStore } from 'components/squads/SquadsStore'
import { useRPCStore } from 'stores/rpcStore'
import { Faction } from '@staratlas/profile-faction'

export function getEnumKeys<T>(enumObj: T): string[] {
  return Object.keys(enumObj as never).filter((key) => isNaN(Number(key)))
}

export function getEnumByKey(key: string): Faction {
  return Faction[key as keyof typeof Faction]
}

export function OLD_keypairToAsyncSigner(keypair: Keypair): AsyncSigner<WalletStore> {
  return {
    publicKey: () => keypair.publicKey,
    requiresAsync(): boolean {
      return true
    },
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

export async function handleStaratlasTransaction(
  label = 'Unlabeled transaction',
  instructions: InstructionReturn | InstructionReturn[],
  feePayer: AsyncSigner,
  retryInterval = 3000,
  maxRetries = 10,
) {
  const notif = Notify.create({
    group: false, // required to be updatable
    timeout: 0, // we want to be in control when it gets dismissed
    spinner: true,
    message: label,
    position: 'bottom-right',
  })

  try {
    notif({
      caption: `Waiting for user to sign...`,
    })

    const LUT = (
      await useRPCStore().connection.getAddressLookupTable(
        new PublicKey('5NrYTRkLRsSSJGgfX2vNRbSXiEFi9yUHV5n7bs7VM9P2'),
      )
    ).value

    const tx = await buildAndSignTransaction(
      instructions,
      feePayer,
      {
        connection: useRPCStore().connection,
        commitment: 'confirmed',
      },
      [LUT!],
    )

    if (!useSquadsStore().useSquads) {
      const rawTransaction = tx.transaction.serialize()
      if (isVersionedTransaction(tx.transaction)) {
        verifySignatures(tx.transaction)
      }

      const signature = await useRPCStore().connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
      })

      let count = 0
      const interval = setInterval(() => {
        if (count < maxRetries) {
          void useRPCStore().connection.sendRawTransaction(rawTransaction, {
            skipPreflight: true,
          })
        }
        count++
      }, retryInterval)

      let result
      try {
        notif({
          color: 'green-5',
          message: `[1/2] Waiting until processed...`,
          caption: `${signature}`,
        })
        result = await useRPCStore().connection.confirmTransaction(
          {
            signature,
            ...tx.rbh,
          },
          'processed',
        )

        notif({
          color: 'green-8',
          message: `[2/2]  Waiting for confirmation...`,
          caption: `${signature}`,
        })

        result = await useRPCStore().connection.confirmTransaction(
          {
            signature,
            ...tx.rbh,
          },
          'confirmed',
        )
      } finally {
        clearInterval(interval)
      }

      if (result.value.err !== null) {
        notif({
          progress: true,
          spinner: false,
          icon: 'error',
          color: 'negative',
          timeout: 5000,
          caption: `Error sending transaction: ${err.toString()}`,
        })
        return { context: result.context, value: err(result.value.err) }
      } else {
        notif({
          color: 'positive',
          timeout: 5000,
          icon: 'done',
          spinner: false,
          message: `Send`,
          caption: `${signature}`,
        })
        return { context: result.context, value: ok(signature) }
      }
    }
  } catch (error) {
    console.log(error)
    notif({
      progress: true,
      spinner: false,
      icon: 'error',
      color: 'negative',
      timeout: 5000,
      caption: `Error signing transaction`,
    })
  }
  /*else {
    console.log(tx.instructions)
    const blockhash = await useRPCStore().connection.getLatestBlockhash()
    const transactionMessage = new TransactionMessage({
      payerKey: new PublicKey(useSquadsStore().vaultPDA),
      recentBlockhash: blockhash.blockhash,
      instructions: tx.instructions,
    })

    await useSquadsStore().loadMultisigInfo()

    const squadsTX = multisig.instructions.vaultTransactionCreate({
      multisigPda: new PublicKey(useSquadsStore().multisigPDA),
      transactionIndex: useSquadsStore().getNewTransactionIndex,
      creator: useWallet().publicKey.value!,
      vaultIndex: 0,
      ephemeralSigners: 0,
      transactionMessage: transactionMessage,
      memo: label,
    })

    signature = await sendTransaction(
      new Transaction().add(squadsTX),
      useRPCStore().connection as Connection,
    )
  }*/
}
