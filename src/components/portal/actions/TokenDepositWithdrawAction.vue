<script lang="ts" setup>
import { getAsyncSigner } from 'src/handler/convert/ToSigner'
import { GameInstructionHandler } from 'src/handler/instructions/GameInstructionHandler'
import { handleStarAtlasTransaction } from 'src/handler/wallet/sendAndSign'
import { useQuasar } from 'quasar'
import { FEE_TYPES } from 'src/handler/instructions/FeeInstructionHandler'
import { useTokenStore } from 'stores/tokenStore'
import type { PropType } from 'vue'
import { usePlayerStore } from 'stores/playerStore'

const props = defineProps({
  direction: {
    type: {} as PropType<'deposit' | 'withdraw'>,
    required: true,
  },
  itemType: {
    type: {} as PropType<'ship' | 'resource'>,
    required: true,
  },
})
const $q = useQuasar()

async function sendTx() {
  const signer = getAsyncSigner()
  const staratlasIxs = []
  const gameInstructionHandler = new GameInstructionHandler(getAsyncSigner())
  try {
    if (!usePlayerStore().starbaseTokenAccountsSelected?.length)
      throw Error(`Please select some ${props.itemType}`)

    for (const sTAS of usePlayerStore().starbaseTokenAccountsSelected ?? []) {
      switch (props.direction) {
        case 'deposit':
          switch (props.itemType) {
            case 'ship':
              staratlasIxs.push(
                ...(await gameInstructionHandler.depositShipToGameIx(
                  sTAS.mint,
                  sTAS.uiAmountSelected,
                )),
              )
              break
            case 'resource':
              staratlasIxs.push(
                ...(await gameInstructionHandler.depositCargoToGameIx(
                  sTAS.mint,
                  sTAS.uiAmountSelected,
                )),
              )
              break
          }
          break

        case 'withdraw':
          switch (props.itemType) {
            case 'ship':
              staratlasIxs.push(
                ...(await gameInstructionHandler.withdrawShipFromGameIx(
                  sTAS.mint,
                  sTAS.uiAmountSelected,
                )),
              )
              break
            case 'resource':
              staratlasIxs.push(
                ...(await gameInstructionHandler.withdrawCargoFromGameIx(
                  sTAS.mint,
                  sTAS.uiAmountSelected,
                )),
              )
              break
          }
          break
      }
    }

    if (staratlasIxs.length > 0)
      await handleStarAtlasTransaction(
        `Token ${props.direction}  [${usePlayerStore().starbaseTokenAccountsSelected?.length}]`,
        staratlasIxs,
        signer,
        FEE_TYPES.DEFAULT_FEE,
      )
    await useTokenStore().updateWalletTokenAccounts(signer.publicKey())
    await usePlayerStore().updateStarbaseTokenAccounts()
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
    @click.prevent="sendTx"
  ></q-btn>
</template>

<style scoped></style>
