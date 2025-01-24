<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { toTokenAccount } from 'stores/interfaces/toTokenAccount'
import { getAccounts } from 'stores/interfaces/rpc'
import { FleetCargoAccount, usePlayerStore } from 'stores/playerStore'

const props = defineProps({
  symbol: {
    type: String,
    default: 'CARGOELEMENT',
  },
  fleet: {
    type: String,
    required: true,
  },
  max: {
    type: Number,
    default: 0,
  },
})

function getCargoMax() {
  switch (props.symbol) {
    case 'AMMO':
      return usePlayerStore().fleets?.find((f) => f.key.toString() == props.fleet?.toString())?.data
        .stats.cargoStats.ammoCapacity
    case 'FUEL':
      return usePlayerStore().fleets?.find((f) => f.key.toString() == props.fleet?.toString())?.data
        .stats.cargoStats.fuelCapacity
    case 'CARGO':
      return usePlayerStore().fleets?.find((f) => f.key.toString() == props.fleet?.toString())?.data
        .stats.cargoStats.cargoCapacity
  }
}

function getCargoAddress() {
  switch (props.symbol) {
    case 'AMMO':
      return usePlayerStore().fleets?.find((f) => f.key.toString() == props.fleet?.toString())?.data
        .ammoBank
    case 'FUEL':
      return usePlayerStore().fleets?.find((f) => f.key.toString() == props.fleet?.toString())?.data
        .fuelTank
    case 'CARGO':
      return usePlayerStore().fleets?.find((f) => f.key.toString() == props.fleet?.toString())?.data
        .cargoHold
  }
}

const tokenAmount = ref(0)
onMounted(async () => {
  tokenAmount.value = toTokenAccount<FleetCargoAccount>(await getAccounts([getCargoAddress()]))
    .flatMap((tA) => tA.uiAmount)
    .reduce((acc, amount) => acc + amount, 0)
})

const percentage = computed(() => {
  return (tokenAmount.value / getCargoMax()).toFixed(3)
})

const color = computed(() => {
  switch (props.symbol) {
    case 'AMMO':
      return 'orange'
    case 'FUEL':
      return 'purple'
    case 'CARGO':
      return 'blue'
    default:
      return 'red'
  }
})
</script>

<template>
  <div class="col">
    <!--    <div class="col text-center">
          <q-avatar size="xs">
            <q-img
              :src="useTokenStore().tokenList.find((t) => t.symbol == props.symbol)?.thumbnailUrl"
            />
          </q-avatar>
        </div>-->

    <q-linear-progress
      :color="color"
      :value="percentage"
      class="q-mb-xs"
      font-size="16px"
      show-value
      size="20px"
      track-color="grey-3"
    >
      <div class="absolute-full flex flex-center">
        <q-badge :label="percentage * 100" color="white" text-color="accent" />
      </div>
    </q-linear-progress>
    <div class="col text-center">{{ tokenAmount }}/{{ getCargoMax() }}</div>
  </div>
</template>

<style scoped></style>
