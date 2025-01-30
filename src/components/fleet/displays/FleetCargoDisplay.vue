<script lang="ts" setup>
import { computed, onMounted, PropType, ref, watch } from 'vue'
import { toTokenAccount } from 'stores/interfaces/toTokenAccount'
import { getAccounts } from 'stores/interfaces/rpc'
import { FleetCargoAccount, usePlayerStore } from 'stores/playerStore'
import { useTokenStore } from 'stores/tokenStore'
import { formatNumber } from 'components/formatter/formatNumber'

const props = defineProps({
  symbol: {
    type: String as PropType<'AMMO' | 'FUEL' | 'CARGO'>,
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

async function load() {
  tokenAmount.value = toTokenAccount<FleetCargoAccount>(await getAccounts([getCargoAddress()]))
    .flatMap((tA) => tA.uiAmount)
    .reduce((acc, amount) => acc + amount, 0)
}

const tokenAmount = ref(0)
onMounted(async () => {
  await load()
})

watch(
  () => usePlayerStore().fleets?.find((f) => f.key.toString() == props.fleet?.toString()),
  async () => {
    await load()
  },
)

const percentage = computed(() => {
  return parseFloat(((tokenAmount.value / getCargoMax()) * 100).toFixed(1))
})
</script>

<template>
  <div class="col">
    <q-circular-progress
      :thickness="0.13"
      :value="percentage"
      class="q-mb-xs"
      color="accent"
      font-size="12px"
      show-value
      size="60px"
      track-color="primary"
    >
      <div class="col q-gutter-y-xs">
        <q-icon v-if="props.symbol === 'CARGO'" name="inventory_2" size="sm" />
        <q-avatar v-else size="sm">
          <q-img
            :src="useTokenStore().tokenList.find((t) => t.symbol == props.symbol)?.thumbnailUrl"
          />
        </q-avatar>
        <div>{{ percentage }}%</div>
      </div>
    </q-circular-progress>

    <div class="col text-center">
      {{ formatNumber(tokenAmount) }}/{{ formatNumber(getCargoMax()) }}
    </div>
  </div>
</template>

<style scoped></style>
