<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { getSigner } from 'components/squads/SignerFinder'
import PlayerProfileOverview from 'components/staratlas/playerProfile/PlayerProfileOverview.vue'
import PlayerProfilePermissions from 'components/staratlas/playerProfile/permissions/PlayerProfilePermissions.vue'
import CreatePlayerProfile from 'components/staratlas/playerProfile/actions/CreateAccounts.vue'
import { updateStores } from 'stores/updateStores'

onMounted(async () => {
  await updateStores()
})

watch(
  () => getSigner(),
  async () => {
    await updateStores()
  },
)

const tab = ref('overview')
</script>

<template>
  <div class="col">
    <q-tabs v-model="tab" align="justify" inline-label>
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
