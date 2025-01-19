<script lang="ts" setup>
import { getAsyncSigner } from 'src/handler/convert/ToSigner'
import { GameInstructionHandler } from 'src/handler/instructions/GameInstructionHandler'
import { handleStarAtlasTransaction } from 'src/handler/wallet/sendAndSign'
import { useQuasar } from 'quasar'
import { FeeInstructionHandler } from 'src/handler/instructions/FeeInstructionHandler'

const props = defineProps(['id'])

const $q = useQuasar()

async function sendTx() {
  const signer = getAsyncSigner()
  const staratlasIxs = []
  const gameInstructionHandler = new GameInstructionHandler(signer)
  const feeInstructionHandler = new FeeInstructionHandler(signer)

  try {
    staratlasIxs.push(...(await gameInstructionHandler.depositCrewToGameIx(props.id.toString())))

    console.log('staratlasIxs', staratlasIxs)

    if (staratlasIxs.length > 0)
      await handleStarAtlasTransaction(
        `Instructions Deposit`,
        staratlasIxs,
        signer,
        feeInstructionHandler.transferFeeIx('DEFAULT'),
      )
  } catch (error: any) {
    $q.notify({
      type: 'warning',
      message: 'warning',
      caption: error.toString(),
      position: 'bottom-right',
    })
  }
}
</script>

<template>
  <q-btn color="primary" icon-right="call_made" label="Deposit" @click="sendTx"></q-btn>
</template>

<style scoped></style>
