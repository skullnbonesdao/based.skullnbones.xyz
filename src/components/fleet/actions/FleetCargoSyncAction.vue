<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { getAsyncSigner } from 'src/handler/convert/ToSigner'
import { GameInstructionHandler } from 'src/handler/instructions/GameInstructionHandler'
import { handleStarAtlasTransaction } from 'src/handler/wallet/sendAndSign'
import { FEE_TYPES } from 'src/handler/instructions/FeeInstructionHandler'
import { PublicKey } from '@solana/web3.js'
import { ref } from 'vue'

const props = defineProps({
  fleet: { type: PublicKey, required: true },
  cargoMint: {
    type: PublicKey,
    required: true,
  },
  shouldAmount: {
    type: Number,
    default: 0,
  },
  isAmount: {
    type: Number,
    default: 0,
  },
})

const $q = useQuasar()
const inputAmount = ref(props.initAmount)

async function sendTx() {
  const signer = getAsyncSigner()
  const staratlasIxs = []
  const gameInstructionHandler = new GameInstructionHandler(getAsyncSigner())

  try {
    staratlasIxs.push(
      ...(await gameInstructionHandler.cargoToFleetIx(
        props.fleet,
        props.cargoType,
        inputAmount.value,
      )),
    )
    if (staratlasIxs.length > 0)
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
  <div class="row justify-end">
    <q-btn color="secondary" label="Sync" @click.prevent="sendTx" />
  </div>
</template>

<style scoped></style>
