<template>
  <router-view />
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { initWorkspaceAdapter, useWorkspaceAdapter } from 'components/staratlas/connector'
import { useRPCStore } from 'stores/rpcStore'

useQuasar().dark.set(true)
useRPCStore().update_connection()
useWorkspaceAdapter()
initWorkspaceAdapter()
</script>
