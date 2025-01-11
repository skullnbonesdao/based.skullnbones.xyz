<script lang="ts" setup>
import { onMounted, watch } from 'vue'

import { getSigner } from 'components/squads/SignerFinder'
import { useStarbaseStore } from 'stores/starbase-store'
import DepositResources from 'components/staratlas/sage/portal/DepositResources.vue'
import { byteArrayToString } from '@staratlas/data-source'
import { useProfileStore } from 'stores/profileStore'

onMounted(async () => {
  await useProfileStore().updateStore(getSigner())
  await useStarbaseStore().updateStore()
})

watch(
  () => getSigner(),
  async () => {
    await useProfileStore().updateStore(getSigner())
  },
)

watch(
  () => useStarbaseStore().starbase,
  async () => {
    await useStarbaseStore().updateStore()
  },
)
</script>
<template>
  <q-page class="">
    <q-select
      v-model="useStarbaseStore().starbase"
      :option-label="(value) => byteArrayToString(value.data.name)"
      :options="
        useStarbaseStore().starbases?.filter((starbase) =>
          byteArrayToString(starbase.data.name).includes('Central'),
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
        <DepositResources />
        <!--        {{ useStarbaseStore().starbase }}
                {{ useStarbaseStore().starbasePlayer }}-->
        {{ useStarbaseStore().starbase }}
      </q-card>
    </div>
  </q-page>
</template>
