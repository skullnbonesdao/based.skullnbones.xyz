<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { findCargoPodAddress } from 'src/handler/interfaces/CargoInterface'

const data = ref()
onMounted(async () => {
  data.value = await findCargoPodAddress()
})
</script>

<template>
  <q-page>
    <div>TEST PAGE</div>
    {{ data }}
  </q-page>
</template>

<style scoped></style>
