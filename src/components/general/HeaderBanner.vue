<script lang="ts" setup>
const props = defineProps({
  text: {
    type: String,
    default: 'none',
  },
})
</script>

<template>
  <div class="col q-pa-sm">
    <q-card bordered class="text-h4 text-center" flat>{{ props.text }}</q-card>
  </div>
</template>

<style scoped></style>
