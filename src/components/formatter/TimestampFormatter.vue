<script lang="ts" setup>
import { date } from 'quasar'

defineProps(['unixTimestamp'])
</script>

<template>
  {{ date.formatDate(unixTimestamp * 1000, 'YYYY-MM-DD HH:mm') }}
</template>

<style scoped></style>
