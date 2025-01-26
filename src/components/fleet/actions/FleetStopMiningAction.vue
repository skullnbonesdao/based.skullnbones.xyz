<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { getAsyncSigner } from 'src/handler/convert/ToSigner'
import { GameInstructionHandler } from 'src/handler/instructions/GameInstructionHandler'
import { handleStarAtlasTransaction } from 'src/handler/wallet/sendAndSign'
import { FEE_TYPES } from 'src/handler/instructions/FeeInstructionHandler'
import { PublicKey } from '@solana/web3.js'
import { loadFleets } from 'src/handler/interfaces/GameInterface'
import { usePlayerStore } from 'stores/playerStore'

const props = defineProps({
  fleet: { type: PublicKey, required: true },
})

const $q = useQuasar()

async function sendTx() {
  const signer = getAsyncSigner()
  const staratlasIxs = []
  const gameInstructionHandler = new GameInstructionHandler(getAsyncSigner())

  try {
    staratlasIxs.push(...(await gameInstructionHandler.asteroidMiningHandler(props.fleet)))
    staratlasIxs.push(...(await gameInstructionHandler.stopMining(props.fleet)))
    if (staratlasIxs.length > 0)
      await handleStarAtlasTransaction(
        `Instructions stop mining`,
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
    <q-btn color="secondary" icon="airline_stops" @click.prevent="sendTx">
      <q-tooltip>Stop mining</q-tooltip>
    </q-btn>
  </div>
</template>

<style scoped></style>
