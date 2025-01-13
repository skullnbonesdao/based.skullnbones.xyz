<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { getSigner } from 'components/squads/SignerFinder'
import PlayerProfileOverview from 'components/playerProfile/PlayerProfileOverview.vue'
import PlayerProfilePermissions from 'components/playerProfile/permissions/PlayerProfilePermissions.vue'
import CreatePlayerProfile from 'components/playerProfile/actions/CreateAccounts.vue'
import { useProfileStore } from 'stores/profileStore'
import { useGameStore } from 'stores/gameStore'

onMounted(async () => {
  await update()
})

watch(
  () => getSigner(),
  async () => {
    await update()
  },
)

async function update() {
  await useProfileStore().updateStore(getSigner())
  await useGameStore().updateStore()
}

const tab = ref('overview')
</script>

<template>
  <div class="col">
    <q-tabs v-model="tab" active-bg-color="primary" align="justify" inline-label>
      <q-tab icon="dashboard" label="Overview" name="overview" />
      <q-tab icon="settings" label="Permissions" name="permissions" />
    </q-tabs>
    <q-separator />
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
