<script lang="ts" setup>
import { getAsyncSigner } from 'src/handler/convert/ToSigner'
import { GameInstructionHandler } from 'src/handler/instructions/GameInstructionHandler'
import { handleStarAtlasTransaction } from 'src/handler/wallet/sendAndSign'
import { useQuasar } from 'quasar'
import { FEE_TYPES } from 'src/handler/instructions/FeeInstructionHandler'

const props = defineProps(['id'])

const $q = useQuasar()

async function sendTx() {
  const signer = getAsyncSigner()
  const staratlasIxs = []
  const gameInstructionHandler = new GameInstructionHandler(signer)

  try {
    /* staratlasIxs.push(
       ixToIxReturn(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 426 })),
     )
     staratlasIxs.push(ixToIxReturn(ComputeBudgetProgram.setComputeUnitLimit({ units: 1_400_000 })))*/
    staratlasIxs.push(...(await gameInstructionHandler.withdrawCrewFromGameIx(props.id.toString())))

    await handleStarAtlasTransaction(
      `Instructions Withdraw`,
      staratlasIxs,
      signer,
      FEE_TYPES.DEFAULT_FEE,
    )
  } catch (error: unknown) {
    $q.notify({
      type: 'warning',
      message: 'warning',
      caption: error!.toString(),
      position: 'bottom-right',
    })
  }
}
</script>

<template>
  <q-btn color="primary" icon-right="call_received" label="Withdraw" @click="sendTx"></q-btn>
</template>

<style scoped></style>
