<script lang="ts" setup>
import { getAsyncSigner } from 'src/handler/convert/ToSigner'
import { GameInstructionHandler } from 'src/handler/instructions/GameInstructionHandler'
import { handleStarAtlasTransaction } from 'src/handler/wallet/sendAndSign'
import { useQuasar } from 'quasar'

const props = defineProps(['id'])

const $q = useQuasar()

async function sendTx() {
  const signer = getAsyncSigner()
  const staratlasIxs = []
  const gameInstructionHandler = new GameInstructionHandler(getAsyncSigner())

  try {
    if (staratlasIxs.length > 0) throw new Error('not implemented')
    await handleStarAtlasTransaction(`Instructions Deposit`, staratlasIxs, signer)
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
