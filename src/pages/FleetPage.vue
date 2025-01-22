<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { getSigner } from 'components/squads/SignerFinder'
import { byteArrayToString } from '@staratlas/data-source'
import { useProfileStore } from 'stores/profileStore'
import { useGameStore } from 'stores/gameStore'
import { useTokenStore } from 'stores/tokenStore'
import InfoBanner from 'components/general/InfoBanner.vue'
import LoadingAnimation from 'components/general/LoadingAnimation.vue'
import FleetCreateView from 'components/fleet/views/FleetCreateView.vue'
import FleetTable from 'components/fleet/views/FleetTable.vue'
import { Faction } from '@staratlas/profile-faction'

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
    await useGameStore().updateStarbasePlayer()
    await useTokenStore().updateStore(getSigner())
  },
)

watch(
  () => useGameStore().starbases,
  () => {
    useGameStore().starbase = useGameStore().starbases!.find(
      (starbase) =>
        byteArrayToString(starbase.data.name).toLowerCase().includes('Central'.toLowerCase()) &&
        byteArrayToString(starbase.data.name)
          .toLowerCase()
          .includes(
            (Faction[useProfileStore().factionProfile?.data.faction ?? 0] ?? 'none').toLowerCase(),
          ),
    )
  },
)
</script>
<template>
  <q-page v-if="!useGameStore().starbases?.length" class="row justify-center items-center">
    <LoadingAnimation />
  </q-page>
  <q-page v-else class="">
    <div>
      <q-tabs v-model="tabAction" active-bg-color="primary" align="justify" inline-label>
        <q-tab label="Manage" name="manage"></q-tab>
        <q-tab label="Create" name="create"></q-tab>
      </q-tabs>

      <FleetTable v-if="tabAction == 'manage'" :rows="useGameStore().fleets" />

      <div v-if="tabAction == 'create'">
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

        <FleetCreateView v-else />
      </div>
    </div>
  </q-page>
</template>
