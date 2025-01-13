<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { getSigner } from 'components/squads/SignerFinder'
import { byteArrayToString } from '@staratlas/data-source'
import { useProfileStore } from 'stores/profileStore'
import { useGameStore } from 'stores/gameStore'
import { useTokenStore } from 'stores/tokenStore'
import TokenTable from 'components/portal/TokenTable.vue'

const tabDirection = ref('deposit')
const tabItemType = ref('ship')

onMounted(async () => {
  await useProfileStore().updateStore(getSigner())
  await useGameStore().updateStore()
})

watch(
  () => getSigner(),
  async () => {
    await useProfileStore().updateStore(getSigner())
  },
)

watch(
  () => useGameStore().starbase,
  async () => {
    await useGameStore().updateStore()
    await useTokenStore().updateStore(getSigner())
  },
)
</script>
<template>
  <q-page class="">
    <q-select
      v-model="useGameStore().starbase"
      :option-label="(value) => byteArrayToString(value.data.name)"
      :options="
        useGameStore().starbases?.filter((starbase) =>
          byteArrayToString(starbase.data.name).includes('Central'),
        )
      "
      class=""
      label="Selected Starbase"
      square
      standout
    >
      <template v-slot:prepend>
        <q-icon name="home" />
      </template>
    </q-select>
    <q-separator />
    <q-tabs v-model="tabDirection" active-bg-color="primary" align="justify" inline-label>
      <q-tab icon="call_made" label="Deposit" name="deposit"></q-tab>
      <q-tab icon="call_received" label="Withdraw" name="withdraw"></q-tab>
    </q-tabs>
    <q-separator />
    <q-tabs v-model="tabItemType" active-bg-color="primary" align="justify">
      <q-tab label="Ships" name="ship"></q-tab>
      <q-tab label="Resources" name="resource"></q-tab>
      <q-tab label="Crew" name="crew"></q-tab>
    </q-tabs>
    <q-separator />

    <TokenTable
      v-if="tabDirection === 'deposit' && useTokenStore().walletTokenAccounts"
      :direction="tabDirection"
      :item-type="tabItemType"
      :rows="useTokenStore().walletTokenAccounts?.filter((acc) => acc.itemType == tabItemType)"
    />

    <TokenTable
      v-if="tabDirection === 'withdraw' && useTokenStore().gameTokenAccounts"
      :direction="tabDirection"
      :item-type="tabItemType"
      :rows="useTokenStore().gameTokenAccounts?.filter((acc) => acc.itemType == tabItemType)"
    />
  </q-page>
</template>
