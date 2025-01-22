<script lang="ts" setup>
const props = defineProps({
  text: {
    type: String,
    default: 'none',
  },
})
</script>

<template>
  <div>
    <q-card bordered class="text-h4 text-center q-ma-sm q-pa-xs" flat>{{ props.text }}</q-card>
  </div>
</template>

<style scoped></style>
