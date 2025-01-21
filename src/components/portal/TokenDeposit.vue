<script lang="ts" setup>
import { getAsyncSigner } from 'src/handler/convert/ToSigner'
import { GameInstructionHandler } from 'src/handler/instructions/GameInstructionHandler'
import { handleStarAtlasTransaction } from 'src/handler/wallet/sendAndSign'
import { useQuasar } from 'quasar'
import { FEE_TYPES } from 'src/handler/instructions/FeeInstructionHandler'
import { useTokenStore } from 'stores/tokenStore'
import { useGameStore } from 'stores/gameStore'

const props = defineProps(['mint', 'amount', 'itemType'])

const $q = useQuasar()

async function sendTx() {
  const signer = getAsyncSigner()
  const staratlasIxs = []
  const gameInstructionHandler = new GameInstructionHandler(getAsyncSigner())
  try {
    switch (props.itemType) {
      case 'ship':
        staratlasIxs.push(
          ...(await gameInstructionHandler.depositShipToGameIx(props.mint, props.amount)),
        )
        break
      case 'resource':
        staratlasIxs.push(
          ...(await gameInstructionHandler.depositCargoToGameIx(props.mint, props.amount)),
        )
        break
    }

    if (staratlasIxs.length > 0)
      await handleStarAtlasTransaction(
        `Instructions Deposit`,
        staratlasIxs,
        signer,
        FEE_TYPES.DEFAULT_FEE,
      )
    await useGameStore().updateStarbasePlayer()
    await useTokenStore().updateStore(signer.publicKey())
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
  <q-btn color="primary" icon-right="call_made" label="Deposit" @click.prevent="sendTx"></q-btn>
</template>

<style scoped></style>
