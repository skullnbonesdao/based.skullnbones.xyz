<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { getAsyncSigner } from 'src/handler/convert/ToSigner'
import { GameInstructionHandler } from 'src/handler/instructions/GameInstructionHandler'
import { handleStarAtlasTransaction } from 'src/handler/wallet/sendAndSign'
import { FEE_TYPES } from 'src/handler/instructions/FeeInstructionHandler'
import { ref } from 'vue'
import { loadFleets } from 'src/handler/interfaces/GameInterface'
import { usePlayerStore } from 'stores/playerStore'

const inputFleetName = ref('')
const $q = useQuasar()

async function sendTx() {
  const signer = getAsyncSigner()
  const staratlasIxs = []
  const gameInstructionHandler = new GameInstructionHandler(getAsyncSigner())

  try {
    if (!inputFleetName.value.length) throw Error('Input FleetName is required')

    const shipMint = usePlayerStore()!.starbaseTokenAccountsSelected![0]!.mint
    const shipAmount = usePlayerStore()!.starbaseTokenAccountsSelected![0]!.uiAmountSelected

    staratlasIxs.push(
      ...gameInstructionHandler.createNewFleetIx(shipMint, shipAmount, inputFleetName.value),
    )
    if (staratlasIxs.length > 0)
      await handleStarAtlasTransaction(
        `Create fleet...`,
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
  <div class="row q-gutter-x-xs">
    <q-input v-model="inputFleetName" class="col" label="Fleet Name" standout />
    <q-btn color="primary" label="Form new fleet" @click.prevent="sendTx" />
  </div>
</template>

<style scoped></style>
