<template>
  <router-view />
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { initWorkspaceAdapter, useWorkspaceAdapter } from 'components/staratlas/connector'
import { useRPCStore } from 'stores/rpcStore'
import { initHandler, useHandler } from 'src/handler/useHandler'
import { onMounted } from 'vue'

useQuasar().dark.set(true)
useRPCStore().update_connection()
useWorkspaceAdapter()
initWorkspaceAdapter()

useHandler()

onMounted(async () => {
  initHandler()
})
</script>
