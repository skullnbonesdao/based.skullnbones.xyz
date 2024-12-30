<script lang="ts" setup>
import { useSquadsStore } from 'components/squads/SquadsStore'
</script>

<template>
  <q-badge color="secondary">
    <div style="font-size: 12px">
      {{ useSquadsStore().store.find((s: any) => s.value == useSquadsStore().multisigPDA)?.label }}
    </div>
  </q-badge>
</template>

<style scoped></style>
