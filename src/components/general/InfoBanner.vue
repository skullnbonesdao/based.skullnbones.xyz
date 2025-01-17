<script lang="ts" setup>
defineProps(['message'])
</script>

<template>
  <div class="row text-h4 text-center items-center q-ma-md">
    <q-icon class="col" name="arrow_upward" size="xl" />
    <div>
      {{ message }}
    </div>
    <q-icon class="col" name="arrow_upward" size="xl" />
  </div>
</template>

<style scoped></style>
