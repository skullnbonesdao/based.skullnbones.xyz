<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { getAsyncSigner } from 'src/handler/convert/ToSigner'
import { GameInstructionHandler } from 'src/handler/instructions/GameInstructionHandler'
import { handleStarAtlasTransaction } from 'src/handler/wallet/sendAndSign'
import { FEE_TYPES } from 'src/handler/instructions/FeeInstructionHandler'
import { PublicKey } from '@solana/web3.js'
import { usePlayerStore } from 'stores/playerStore'

const props = defineProps({
  fleet: { type: PublicKey, required: true },
  cargoMint: {
    type: PublicKey,
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
  },
})

const $q = useQuasar()

async function sendTx() {
  const signer = getAsyncSigner()
  const staratlasIxs = []
  const gameInstructionHandler = new GameInstructionHandler(getAsyncSigner())

  try {
    if (props.amount > 0) {
      staratlasIxs.push(
        ...(await gameInstructionHandler.cargoToFleetIx(
          props.fleet,
          props.cargoMint,
          Math.abs(props.amount),
        )),
      )
    }

    if (props.amount < 0) {
      staratlasIxs.push(
        ...(await gameInstructionHandler.cargoToStarbaseIx(
          props.fleet,
          props.cargoMint,
          Math.abs(props.amount),
        )),
      )
    }

    if (staratlasIxs.length > 0)
      await handleStarAtlasTransaction(
        `Transfer Cargo: ${props.amount > 0 ? 'Starbase -> Fleet' : 'Fleet -> Starbase'}`,
        staratlasIxs,
        signer,
        FEE_TYPES.DEFAULT_FEE,
      )

    await usePlayerStore().updateFleet()
    await usePlayerStore().updateFleetCargoAccounts(props.fleet)
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
