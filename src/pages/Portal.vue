<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { getSigner } from 'components/squads/SignerFinder'
import { byteArrayToString } from '@staratlas/data-source'
import { useProfileStore } from 'stores/profileStore'
import { useGameStore } from 'stores/gameStore'
import { useTokenStore } from 'stores/tokenStore'
import TokenTable from 'components/portal/TokenTable.vue'

const tabItemType = ref()

onMounted(async () => {
  await useProfileStore().updateStore(getSigner())
  await useGameStore().updateStore()
  await useTokenStore().updateStore(getSigner())
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
      label="Selected Starbase"
    />
    <q-tabs align="justify">
      <q-tab label="IN"></q-tab>
      <q-tab label="OUT"></q-tab>
    </q-tabs>
    <q-tabs v-model="tabItemType" align="justify">
      <q-tab label="Ships" name="ship"></q-tab>
      <q-tab label="Resources" name="resource"></q-tab>
      <q-tab label="Crew" name="crew"></q-tab>
    </q-tabs>

    <q-tab-panels v-model="tabItemType" animated>
      <q-tab-panel name="ship">
        <TokenTable
          :rows="useTokenStore().walletTokenAccounts?.filter((acc) => acc.itemType == tabItemType)"
        />
      </q-tab-panel>

      <q-tab-panel name="resource">
        <TokenTable
          :rows="useTokenStore().walletTokenAccounts?.filter((acc) => acc.itemType == tabItemType)"
        />
      </q-tab-panel>

      <q-tab-panel name="crew">
        <TokenTable
          :rows="useTokenStore().walletTokenAccounts?.filter((acc) => acc.itemType == tabItemType)"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
