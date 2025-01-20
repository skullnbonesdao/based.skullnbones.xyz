<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { getSigner } from 'components/squads/SignerFinder'
import { byteArrayToString } from '@staratlas/data-source'
import { useProfileStore } from 'stores/profileStore'
import { useGameStore } from 'stores/gameStore'
import { useTokenStore } from 'stores/tokenStore'
import InfoBanner from 'components/general/InfoBanner.vue'
import LoadingAnimation from 'components/general/LoadingAnimation.vue'

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

    <InfoBanner v-if="!useGameStore().starbase" message="Please select a starabse" />

    <div v-if="useGameStore().starbase">dad</div>
  </q-page>
</template>
