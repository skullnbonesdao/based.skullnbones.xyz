<script lang="ts" setup>
import { useSquadsStore } from 'components/squads/SquadsStore'
</script>

<template>
  <div class="row">
    <q-toggle
      v-model="useSquadsStore().useSquads"
      checked-icon="check"
      dense
      label=""
      unchecked-icon="clear"
    />
    <div class="col items-center">
      <div class="col text-center">Sign As:</div>
      <SquadsBadge />
    </div>
  </div>
</template>

<style scoped></style>
