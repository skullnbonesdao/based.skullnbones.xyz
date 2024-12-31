import { PublicKey, Transaction, TransactionMessage } from '@solana/web3.js'
import type { WalletStore } from 'solana-wallets-vue/dist/types'
import {
  AsyncSigner,
  buildAndSignTransaction,
  buildDynamicTransactionsNoSigning,
  InstructionReturn,
  InstructionsWithSignersAndLUTs,
  TransactionReturn,
} from '@staratlas/data-source'
import { err, ok } from 'neverthrow'
import {
  isVersionedTransaction,
  verifySignatures,
} from '@staratlas/data-source/src/transactions/transactionHandling'
import { Notify } from 'quasar'
import { useSquadsStore } from 'components/squads/SquadsStore'
import { useRPCStore } from 'stores/rpcStore'
import { Faction } from '@staratlas/profile-faction'
import * as multisig from '@sqds/multisig'
import { useWallet } from 'solana-wallets-vue'

export function getEnumKeys<T>(enumObj: T): string[] {
  return Object.keys(enumObj as never).filter((key) => isNaN(Number(key)))
}

export function getEnumByKey(key: string): Faction {
  return Faction[key as keyof typeof Faction]
}

export function publicKeyToAsyncSigner(publicKey: PublicKey): AsyncSigner<WalletStore> {
  return {
    publicKey: () => publicKey,
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

    if (useSquadsStore().useSquads) {
      const tx = await prepareSquadsTransaction(instructions, feePayer, label)
      await sendSquadsAndCheck(tx, notif)
    } else {
      const tx = await prepareWalletTransaction(instructions, feePayer)
      await sendWalletAndCheck(tx, retryInterval, maxRetries, notif)
    }
  } catch (error) {
    console.error(error)
    notif({
      progress: true,
      spinner: false,
      icon: 'error',
      color: 'negative',
      timeout: 5000,
      caption: `Error signing transaction`,
    })
  }
}

async function prepareWalletTransaction(
  instructions: InstructionReturn | InstructionReturn[],
  feePayer: AsyncSigner,
) {
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

  return tx
}

async function prepareSquadsTransaction(
  instructions: InstructionReturn | InstructionReturn[],
  feePayer: AsyncSigner,
  label: string,
): Promise<Transaction> {
  const blockhash = await useRPCStore().connection.getLatestBlockhash()

  const transactionMessage = new TransactionMessage({
    payerKey: new PublicKey(useSquadsStore().vaultPDA),
    recentBlockhash: blockhash.blockhash,
    instructions: [],
  })

  const d = await buildDynamicTransactionsNoSigning(instructions, feePayer)

  const signers: any[] = []
  d.map((instructionsWithSignersAndLUTs: InstructionsWithSignersAndLUTs[]) => {
    console.log(instructionsWithSignersAndLUTs)
    instructionsWithSignersAndLUTs.forEach((inner) =>
      inner.instructions.forEach((instruction) => {
        transactionMessage.instructions.push(instruction.instruction)
        instruction.signers.map((s) => signers.push(s))
      }),
    )
  })

  await useSquadsStore().update()

  const squadsTX = multisig.instructions.vaultTransactionCreate({
    multisigPda: new PublicKey(useSquadsStore().multisigPDA),
    transactionIndex: useSquadsStore().getNewTransactionIndex,
    creator: useWallet().publicKey.value!,
    vaultIndex: 0,
    ephemeralSigners: 0,
    transactionMessage: transactionMessage,
    memo: label,
  })

  const transaction = new Transaction().add(squadsTX)

  return transaction
}

async function sendSquadsAndCheck(tx: Transaction, notif: any) {
  const signature = await useWallet().sendTransaction(tx, useRPCStore().connection)
  const blockhash = await useRPCStore().connection.getLatestBlockhash()

  let result

  notif({
    color: 'green-5',
    message: `[1/2] Waiting until processed...`,
    caption: `${signature}`,
  })
  result = await useRPCStore().connection.confirmTransaction(
    {
      signature,
      blockhash: blockhash.blockhash,
      lastValidBlockHeight: blockhash.lastValidBlockHeight,
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
      blockhash: blockhash.blockhash,
      lastValidBlockHeight: blockhash.lastValidBlockHeight,
    },
    'confirmed',
  )

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

async function sendWalletAndCheck(
  tx: TransactionReturn,
  retryInterval = 3000,
  maxRetries = 10,
  notif: any,
) {
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
