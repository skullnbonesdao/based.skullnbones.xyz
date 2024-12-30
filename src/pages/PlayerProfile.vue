<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { usePlayerProfileStore } from '../stores/player-profile-store'
import { getSigner } from 'components/squads/SignerFinder'
import { useGameStore } from '../stores/game-store'
import { useFactionStore } from 'stores/faction-store'
import PlayerProfileOverview from 'components/staratlas/playerProfile/PlayerProfileOverview.vue'
import PlayerProfilePermissions from 'components/staratlas/playerProfile/PlayerProfilePermissions.vue'
import CreatePlayerProfile from 'components/staratlas/playerProfile/actions/CreatePlayerProfile.vue'
import { usePointsStore } from 'stores/points-store'

onMounted(async () => {
  usePlayerProfileStore().wallet = getSigner()
  await usePlayerProfileStore().updateStore()
  await useGameStore().updateStore()
  await useFactionStore().updateStore()
  await usePointsStore().updateStore()
})

const tab = ref('overview')
</script>

<template>
  <div class="col">
    <q-tabs v-model="tab">
      <q-tab icon="dashboard" label="Overview" name="overview" />
      <q-tab icon="settings" label="Permissions" name="permissions" />
    </q-tabs>
    <q-tab-panels v-model="tab">
      <q-tab-panel class="q-gutter-md" name="overview">
        <PlayerProfileOverview />
        <CreatePlayerProfile />
      </q-tab-panel>
      <q-tab-panel name="permissions">
        <PlayerProfilePermissions />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<style scoped></style>
