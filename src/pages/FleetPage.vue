<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getSigner } from 'components/squads/SignerFinder'
import { byteArrayToString } from '@staratlas/data-source'
import { useProfileStore } from 'stores/profileStore'
import { useGameStore } from 'stores/gameStore'
import InfoBanner from 'components/general/InfoBanner.vue'
import LoadingAnimation from 'components/general/LoadingAnimation.vue'
import FleetCreateView from 'components/fleet/views/FleetCreateView.vue'
import FleetTable from 'components/fleet/views/FleetTable.vue'
import { usePlayerStore } from 'stores/playerStore'

const tabAction = ref('manage')

onMounted(async () => {
  await useProfileStore().updateStore(getSigner())
  await useGameStore().updateStore()
})
</script>
<template>
  <q-page v-if="!useGameStore().starbases?.length" class="row justify-center items-center">
    <LoadingAnimation />
  </q-page>
  <q-page v-else class="">
    <div>
      <q-separator />
      <q-tabs v-model="tabAction" active-bg-color="primary" align="justify" inline-label>
        <q-tab label="Manage" name="manage"></q-tab>
        <q-tab label="Create" name="create"></q-tab>
      </q-tabs>
      <q-separator />

      <InfoBanner
        v-if="!usePlayerStore().fleets?.length && tabAction == 'manage'"
        message="Fleets found"
      />

      <FleetTable v-else-if="tabAction == 'manage'" :rows="usePlayerStore().fleets" />

      <div v-if="tabAction == 'create'">
        <q-select
          v-model="usePlayerStore().currentStarbase"
          :disable="true"
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
        <InfoBanner v-if="!usePlayerStore().currentStarbase" message="Please select a starbase" />

        <FleetCreateView v-else />
      </div>
    </div>
  </q-page>
</template>
