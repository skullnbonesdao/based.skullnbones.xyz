<script lang="ts" setup>
import { useTokenStore } from 'stores/tokenStore'
import { useQuasar } from 'quasar'
import { getAsyncSigner } from 'src/handler/convert/ToSigner'
import { GameInstructionHandler } from 'src/handler/instructions/GameInstructionHandler'
import { handleStarAtlasTransaction } from 'src/handler/wallet/sendAndSign'
import { FEE_TYPES } from 'src/handler/instructions/FeeInstructionHandler'
import { ref } from 'vue'
import { loadFleets } from 'src/handler/interfaces/GameInterface'
import { usePlayerStore } from 'stores/playerStore'

const inputFleetName = ref('test')
const $q = useQuasar()

async function sendTx() {
  const signer = getAsyncSigner()
  const staratlasIxs = []
  const gameInstructionHandler = new GameInstructionHandler(getAsyncSigner())

  try {
    const shipMint = useTokenStore()!.gameTokenAccountsSelected![0]!.mint
    const shipAmount = useTokenStore()!.gameTokenAccountsSelected![0]!.uiAmountSelected

    staratlasIxs.push(
      ...gameInstructionHandler.createNewFleetIx(shipMint, shipAmount, inputFleetName.value),
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
  <q-input v-model="inputFleetName" label="Fleet Name" />
  <q-btn class="full-width" color="primary" label="Form new fleet" @click.prevent="sendTx" />
</template>

<style scoped></style>
