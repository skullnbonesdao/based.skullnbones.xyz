<script lang="ts" setup>
import { onMounted, watch } from 'vue'
import { updateStores } from 'stores/updateStores'
import { getSigner } from 'components/squads/SignerFinder'
import { useStarbaseStore } from 'stores/starbase-store'
import { byteArrayToString } from '@staratlas/data-source'

onMounted(async () => {
  await updateStores()
  await useStarbaseStore().updateStore()
})

watch(
  () => getSigner(),
  async () => {
    await updateStores()
  },
)

watch(
  () => useStarbaseStore().starbaseSelected,
  async () => {
    await useStarbaseStore().updateStore()
  },
)
</script>
<template>
  <q-page class="">
    <q-select
      v-model="useStarbaseStore().starbaseSelected"
      :option-label="(value) => byteArrayToString(value.account.name)"
      :options="
        useStarbaseStore().starbases?.filter((starbase) =>
          byteArrayToString(starbase.account.name).includes('Central'),
        )
      "
      label="Selected Starbase"
    />
    <q-tabs align="justify">
      <q-tab label="IN"></q-tab>
      <q-tab label="OUT"></q-tab>
    </q-tabs>
    <q-tabs align="justify">
      <q-tab label="Ships"></q-tab>
      <q-tab label="Resources"></q-tab>
      <q-tab label="Crew"></q-tab>
    </q-tabs>
    <div>
      <q-card flat>
        <q-card-section> PORT</q-card-section>

        {{ useStarbaseStore().starbase }}
      </q-card>
    </div>
  </q-page>
</template>
