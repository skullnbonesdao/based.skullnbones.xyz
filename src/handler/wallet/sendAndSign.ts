import {
  ComputeBudgetProgram,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js'
import {
  AsyncSigner,
  buildAndSignTransaction,
  buildDynamicTransactionsNoSigning,
  InstructionReturn,
  InstructionsWithSignersAndLUTs,
  ixToIxReturn,
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
import * as multisig from '@sqds/multisig'
import { useWallet } from 'solana-wallets-vue'
import { getSigner } from 'components/squads/SignerFinder'
import { FEE_TYPES, FeeInstructionHandler } from 'src/handler/instructions/FeeInstructionHandler'

export async function handleStarAtlasTransaction(
  label = 'Unlabeled transaction',
  saInstructions: InstructionReturn | InstructionReturn[],
  feePayer: AsyncSigner,
  fee: FEE_TYPES,
  ephemeralSigners: number = 0,
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

    const saInstructionsArray = Array.isArray(saInstructions) ? saInstructions : [saInstructions]

    const preInstructions =
      saInstructionsArray.length > 1
        ? []
        : [
            ixToIxReturn(
              ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: useRPCStore().computeUnitPrice,
              }),
            ),
          ]

    const instructions = [
      ...preInstructions,
      ...saInstructionsArray,
      ixToIxReturn(new FeeInstructionHandler(feePayer).transferFeeIx(fee)),
    ]

    if (useSquadsStore().useSquads) {
      const tx = await prepareSquadsTransaction(instructions, feePayer, label, ephemeralSigners)
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

  console.log('TX', tx)

  return tx
}

async function prepareSquadsTransaction(
  instructions: InstructionReturn | InstructionReturn[],
  feePayer: AsyncSigner,
  label: string,
  ephemeralSigners: number = 0,
) {
  const blockhash = await useRPCStore().connection.getLatestBlockhash()

  const transactionMessage = new TransactionMessage({
    payerKey: getSigner(),
    recentBlockhash: blockhash.blockhash,
    instructions: [],
  })

  const addressLookupTableAccounts = []
  const LUT1 = (
    await useRPCStore().connection.getAddressLookupTable(
      new PublicKey('5NrYTRkLRsSSJGgfX2vNRbSXiEFi9yUHV5n7bs7VM9P2'),
    )
  ).value

  if (LUT1) {
    addressLookupTableAccounts.push(LUT1)
  }

  const d = await buildDynamicTransactionsNoSigning(instructions, feePayer)

  d.map((instructionsWithSignersAndLUTs: InstructionsWithSignersAndLUTs[]) => {
    console.log(instructionsWithSignersAndLUTs)
    instructionsWithSignersAndLUTs.forEach((inner) =>
      inner.instructions.forEach((instruction) => {
        transactionMessage.instructions.push(instruction.instruction)
      }),
    )
  })

  await useSquadsStore().update()
  console.log(transactionMessage)

  const squadsTransaction = multisig.transactions.vaultTransactionCreate({
    blockhash: blockhash.blockhash,
    feePayer: useWallet().publicKey.value!,
    multisigPda: new PublicKey(useSquadsStore().multisigPDA.toString()),
    transactionIndex: useSquadsStore().getNewTransactionIndex,
    creator: useWallet().publicKey.value!,
    rentPayer: useWallet().publicKey.value!,
    vaultIndex: 0,
    ephemeralSigners: ephemeralSigners,
    transactionMessage: transactionMessage,
    addressLookupTableAccounts: addressLookupTableAccounts,
    memo: label,
  })

  return squadsTransaction
}

async function sendSquadsAndCheck(tx: VersionedTransaction, notif: any) {
  const { sendTransaction } = useWallet()

  const signature = await sendTransaction(tx, useRPCStore().connection, {
    skipPreflight: true,
  })

  const blockhash = await useRPCStore().connection.getLatestBlockhash()

  let result

  notif({
    color: 'green-5',
    message: `[1/3] Waiting until processed...`,
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
    color: 'green-6',
    message: `[2/3]  Waiting for confirmation...`,
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

  notif({
    color: 'green-7',
    message: `[3/3]  Waiting for finalization...`,
    caption: `${signature}`,
  })

  result = await useRPCStore().connection.confirmTransaction(
    {
      signature,
      blockhash: blockhash.blockhash,
      lastValidBlockHeight: blockhash.lastValidBlockHeight,
    },
    'finalized',
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
      message: `[1/3] Waiting until processed...`,
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
      color: 'green-6',
      message: `[2/3]  Waiting for confirmation...`,
      caption: `${signature}`,
    })

    result = await useRPCStore().connection.confirmTransaction(
      {
        signature,
        ...tx.rbh,
      },
      'confirmed',
    )

    notif({
      color: 'green-7',
      message: `[3/3]  Waiting for finalization...`,
      caption: `${signature}`,
    })

    result = await useRPCStore().connection.confirmTransaction(
      {
        signature,
        ...tx.rbh,
      },
      'finalized',
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
