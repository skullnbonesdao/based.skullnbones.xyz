<script lang="ts" setup>
defineProps(['message'])
</script>

<template>
  <div class="row text-h4 text-center items-center q-ma-md">
    <q-icon name="warning" size="md" />
    <q-separator class="col" />
    <div class="q-mx-md">
      {{ message }}
    </div>
    <q-separator class="col" />
    <q-icon name="warning" size="md" />
  </div>
</template>

<style scoped></style>
