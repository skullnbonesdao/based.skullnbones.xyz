<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { getSigner } from 'components/squads/SignerFinder'
import { byteArrayToString } from '@staratlas/data-source'
import { useProfileStore } from 'stores/profileStore'
import { useGameStore } from 'stores/gameStore'
import { useTokenStore } from 'stores/tokenStore'
import InfoBanner from 'components/general/InfoBanner.vue'
import LoadingAnimation from 'components/general/LoadingAnimation.vue'
import FleetCreateView from 'components/fleet/FleetCreateView.vue'
import { findStarbasePlayerAddress } from 'src/handler/interfaces/GameInterface'

const tabAction = ref('manage')

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
  <q-page v-if="!useGameStore().starbases?.length" class="row justify-center items-center">
    <LoadingAnimation />
  </q-page>
  <q-page v-else class="">
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

    <InfoBanner v-if="!useGameStore().starbase" message="Please select a starbase" />

    <div v-if="useGameStore().starbase">
      <q-tabs v-model="tabAction" active-bg-color="secondary" align="justify" inline-label>
        <q-tab label="Manage" name="manage"></q-tab>
        <q-tab label="Create" name="create"></q-tab>
      </q-tabs>

      {{ useGameStore().fleets }}
      <div>====</div>
      {{ findStarbasePlayerAddress() }}

      <FleetCreateView v-if="tabAction == 'create'" />
    </div>
  </q-page>
</template>
