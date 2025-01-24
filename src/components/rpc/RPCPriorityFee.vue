<script lang="ts" setup>
import { useRPCStore } from 'stores/rpcStore.js'
</script>

<template>
  <q-input
    v-model="useRPCStore().computeUnitPrice"
    dense
    label="Transaction: Compute Unit Price"
    standout
  />
</template>

<style scoped></style>
