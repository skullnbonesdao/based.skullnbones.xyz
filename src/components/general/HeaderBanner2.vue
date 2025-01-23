<script lang="ts" setup>
const props = defineProps({
  text: {
    type: String,
    default: 'none',
  },
})
</script>

<template>
  <div class="col">
    <q-separator />
    <q-card class="text-h6 q-pa-sm" flat>{{ props.text }}</q-card>
    <q-separator />
  </div>
</template>

<style scoped></style>
