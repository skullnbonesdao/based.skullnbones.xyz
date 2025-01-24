<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { getAsyncSigner } from 'src/handler/convert/ToSigner'
import { GameInstructionHandler } from 'src/handler/instructions/GameInstructionHandler'
import { handleStarAtlasTransaction } from 'src/handler/wallet/sendAndSign'
import { FEE_TYPES } from 'src/handler/instructions/FeeInstructionHandler'
import { PublicKey } from '@solana/web3.js'
import { ref } from 'vue'
import { usePlayerStore } from 'stores/playerStore'
import { loadFleets } from 'src/handler/interfaces/GameInterface'

const props = defineProps({
  fleet: { type: PublicKey, required: true },
  cargoType: {
    type: String,
    required: true,
  },
  initAmount: {
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
    usePlayerStore().fleets = await loadFleets()
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
  <div class="row">
    <q-input v-model="inputAmount" class="col" dense label="Ammo Amount" standout />
    <q-btn color="secondary" label="Load" @click.prevent="sendTx" />
  </div>
</template>

<style scoped></style>
