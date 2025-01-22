<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { getAsyncSigner } from 'src/handler/convert/ToSigner'
import { GameInstructionHandler } from 'src/handler/instructions/GameInstructionHandler'
import { useTokenStore } from 'stores/tokenStore'
import { handleStarAtlasTransaction } from 'src/handler/wallet/sendAndSign'
import { FEE_TYPES } from 'src/handler/instructions/FeeInstructionHandler'
import { PublicKey } from '@solana/web3.js'
import { loadFleets } from 'src/handler/interfaces/GameInterface'
import { useGameStore } from 'stores/gameStore'

const $q = useQuasar()

const props = defineProps({
  fleet: {
    type: PublicKey,
    required: true,
  },
})

async function sendTx() {
  const signer = getAsyncSigner()
  const staratlasIxs = []
  const gameInstructionHandler = new GameInstructionHandler(getAsyncSigner())

  try {
    staratlasIxs.push(
      ...gameInstructionHandler.addShipsToFleetIx(
        props.fleet,
        useTokenStore().gameTokenAccountsSelected[0]?.mint,
        useTokenStore().gameTokenAccountsSelected[0]?.uiAmountSelected,
      ),
    )
    if (staratlasIxs.length > 0)
      await handleStarAtlasTransaction(
        `Add Ships to fleet`,
        staratlasIxs,
        signer,
        FEE_TYPES.DEFAULT_FEE,
      )

    useGameStore().fleets = await loadFleets()
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
  <q-btn class="" color="secondary" label="Add" @click.prevent="sendTx" />
</template>

<style scoped></style>
