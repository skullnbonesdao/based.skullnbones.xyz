<script lang="ts" setup>
const props = defineProps({
  text: {
    type: String,
    default: 'none',
  },
  caption: {
    type: String,
    default: 'none',
  },
})
</script>

<template>
  <q-card class="text-h6 row q-gutter-x-md q-ma-md" flat>
    <div>
      {{ props.text }}
    </div>
    
    <div class="col text-center">
      {{ props.caption }}
    </div>
  </q-card>
</template>

<style scoped></style>
