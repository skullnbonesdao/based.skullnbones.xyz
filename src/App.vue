<template>
  <router-view />
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { initWorkspaceAdapter, useWorkspaceAdapter } from 'src/handler/connector'
import { useRPCStore } from 'stores/rpcStore'

useQuasar().dark.set(true)

useRPCStore().update_connection()
useWorkspaceAdapter()
initWorkspaceAdapter()

//useGameStore().starbase = useGameStore().persistent.starbase
</script>
