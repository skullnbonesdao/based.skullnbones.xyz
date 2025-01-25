<script lang="ts" setup>
import { getAsyncSigner } from 'src/handler/convert/ToSigner'
import { GameInstructionHandler } from 'src/handler/instructions/GameInstructionHandler'
import { handleStarAtlasTransaction } from 'src/handler/wallet/sendAndSign'
import { useQuasar } from 'quasar'
import { FEE_TYPES } from 'src/handler/instructions/FeeInstructionHandler'
import { usePlayerStore } from 'stores/playerStore'
import { useTokenStore } from 'stores/tokenStore'
import type { PropType } from 'vue'

const $q = useQuasar()
const props = defineProps({
  direction: {
    type: {} as PropType<'deposit' | 'withdraw'>,
    required: true,
  },
})

async function sendTx() {
  const signer = getAsyncSigner()
  const staratlasIxs = []
  const gameInstructionHandler = new GameInstructionHandler(signer)

  try {
    if (usePlayerStore().starbaseCrewAccountsSelected?.length === 0)
      throw Error('Please select some crew')

    switch (props.direction) {
      case 'deposit':
        for (const wCAS of usePlayerStore().starbaseCrewAccountsSelected ?? []) {
          staratlasIxs.push(...(await gameInstructionHandler.depositCrewToGameIx(wCAS)))
        }
        break
      case 'withdraw':
        for (const wCAS of usePlayerStore().starbaseCrewAccountsSelected ?? []) {
          staratlasIxs.push(...(await gameInstructionHandler.withdrawCrewFromGameIx(wCAS)))
        }
        break
    }

    if (staratlasIxs.length > 0)
      await handleStarAtlasTransaction(
        `Crew ${props.direction} [${usePlayerStore().starbaseCrewAccountsSelected?.length}]`,
        staratlasIxs,
        signer,
        FEE_TYPES.DEFAULT_FEE,
      )
    await useTokenStore().updateWalletCrewAccounts(signer.publicKey())
    await usePlayerStore().updateStarbaseCrewAccounts()
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
  <q-btn
    :icon-right="props.direction === 'deposit' ? 'call_made' : 'call_received'"
    :label="props.direction === 'deposit' ? 'Deposit' : 'Withdraw'"
    color="primary"
    @click="sendTx"
  />
</template>

<style scoped></style>
