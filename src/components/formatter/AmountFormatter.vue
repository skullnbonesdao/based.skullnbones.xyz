<script lang="ts" setup>
import { computed } from 'vue'
import { padNumber } from './padNumber'

const props = defineProps(['number', 'decimals', 'padStart', 'url'])

const styledNumber = computed(() => {
  // Regular expression to separate leading zeros
  const regex = /^(0+)(.+)/

  const match = padNumber(props.number, props.decimals, props.padStart).match(regex)

  if (match) {
    const leadingZeros = match[1] // Group 1: Leading zeros
    const rest = match[2] // Group 2: The rest of the number

    // Return HTML string with spans
    return `
          <div class="row" >
          <span class="text-weight-thin text-grey-7 ">${leadingZeros}</span>
          <span class="">${rest}</span>
          </div>
        `
  }

  // If no leading zeros, return the number wrapped in a default class
  return `<span class="rest">${props.number}</span>`
})
</script>

<template>
  <div class="col row q-gutter-x-sm justify-end">
    <div v-html="styledNumber"></div>
    <q-avatar size="xs">
      <q-img :src="url" />
    </q-avatar>
  </div>
</template>

<style lang="sass" scoped></style>
