<script lang="ts" setup>
import { useSquadsStore } from 'components/squads/SquadsStore'
import SquadsBadge from 'components/squads/SquadsBadge.vue'
</script>

<template>
  <div class="row q-pa-md bg-style items-center">
    <q-toggle
      v-model="useSquadsStore().useSquads"
      checked-icon="group"
      color="secondary"
      dense
      label=""
      unchecked-icon="clear"
    />
    <div class="col items-center">
      <SquadsBadge />
    </div>
  </div>
</template>

<style lang="sass" scoped>
.bg-style
  background-color: #2d2d2d
</style>
