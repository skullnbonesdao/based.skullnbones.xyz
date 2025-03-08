<template>
  <router-view />
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { initWorkspaceAdapter, useWorkspaceAdapter } from 'src/handler/connector'
import { useRPCStore } from 'stores/rpcStore'
import { useGameStore } from 'stores/gameStore'
import { usePlayerStore } from 'stores/playerStore'
import { useProfileStore } from 'stores/profileStore'
import { useTokenStore } from 'stores/tokenStore'
import { watch } from 'vue'
import { getSigner } from 'components/squads/SignerFinder'
import { byteArrayToString } from '@staratlas/data-source'
import { Faction } from '@staratlas/profile-faction'

useQuasar().dark.set(true)

useGameStore()
usePlayerStore()
useProfileStore()
useTokenStore()

useRPCStore().update_connection()
useWorkspaceAdapter()
initWorkspaceAdapter()

watch(
  () => getSigner(),
  async () => {
    await useProfileStore().updateStore(getSigner())
  },
)

watch(
  () => usePlayerStore().currentStarbase,
  async () => {
    await usePlayerStore().updateStore()
    await usePlayerStore().updateStarbasePlayer()
    await useTokenStore().updateStore(getSigner())
  },
)

watch(
  () => useGameStore().starbases,
  () => {
    usePlayerStore().currentStarbase = useGameStore().starbases!.find(
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

//useGameStore().starbase = useGameStore().persistent.starbase
</script>

<style>
body {
  zoom: 100%;
}
</style>
