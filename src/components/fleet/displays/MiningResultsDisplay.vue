<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { usePlayerStore } from 'stores/playerStore'
import { Fleet } from '@staratlas/sage'
import { useGameStore } from 'stores/gameStore'
import { useTokenStore } from 'stores/tokenStore'
import { calculateMiningResults } from 'src/handler/interfaces/FleetInterface'
import { getAccount, getAssociatedTokenAddressSync } from '@solana/spl-token'
import { useRPCStore } from 'stores/rpcStore'
import { formatTimeSpan } from '../../formatter/formatTimespan'

const fleetAmmoTokenBefore = ref()
const fleetFoodTokenBefore = ref()

onMounted(async () => {
  const fleet = usePlayerStore().fleets![0]! as Fleet

  fleetAmmoTokenBefore.value = await getAccount(
    useRPCStore().connection,
    getAssociatedTokenAddressSync(useTokenStore().AMMO, fleet.data.ammoBank, true),
    'processed',
  )

  fleetFoodTokenBefore.value = await getAccount(
    useRPCStore().connection,
    getAssociatedTokenAddressSync(useTokenStore().FOOD, fleet.data.cargoHold, true),
    'processed',
  )
})

const remaining = ref(Date.now())

const fleet = computed(() => {
  return usePlayerStore().fleets![0]! as Fleet
})

const mineItem = computed(() => {
  return useGameStore().mineItems?.find(
    (m) => m.data.mint.toString() == useTokenStore().getTokenBySymbol('HYG').toString(),
  )
})

const resource = computed(() => {
  const fleet = usePlayerStore().fleets![0]! as Fleet

  return useGameStore().resources?.find(
    (r) => r.key.toString() == fleet.state.MineAsteroid?.resource.toString(),
  )
})

const calculateAsteroidMiningResourceExtractionDuration = ref()
const calculateAsteroidMiningAmmoDuration = ref()
const calculateAsteroidMiningFoodDuration = ref()
const calculateAsteroidMiningFoodToConsume = ref()
const miningData = ref()

setInterval(() => {
  calculateAsteroidMiningResourceExtractionDuration.value =
    Fleet.calculateAsteroidMiningResourceExtractionDuration(
      usePlayerStore().fleets[0]!.data.stats,
      mineItem.value.data,
      resource.value.data,
      10963 - 398,
    )

  calculateAsteroidMiningAmmoDuration.value = Fleet.calculateAsteroidMiningAmmoDuration(
    usePlayerStore().fleets[0]!.data.stats,
    4109,
  )

  calculateAsteroidMiningFoodDuration.value = Fleet.calculateAsteroidMiningFoodDuration(
    usePlayerStore().fleets[0]!.data.stats,
    398,
  )

  calculateAsteroidMiningFoodToConsume.value = Fleet.calculateAsteroidMiningFoodToConsume(
    usePlayerStore().fleets[0]!.data.stats,
    398,
    calculateAsteroidMiningResourceExtractionDuration.value,
  )

  calculateAsteroidMiningResourceExtractionDuration.value =
    Fleet.calculateAsteroidMiningResourceExtractionDuration(
      usePlayerStore().fleets[0]!.data.stats,
      mineItem.value.data,
      resource.value.data,
      10963 - 398 + 199.5,
    )

  miningData.value = !fleet.value.state.MineAsteroid
    ? 'Fleet not mining'
    : calculateMiningResults(
        fleet.value,
        fleetFoodTokenBefore.value,
        fleetAmmoTokenBefore.value,
        mineItem.value.data,
        resource.value.data,
        0,
      )
}, 1000)
</script>

<template>
  <div>
    <div class="row">
      <div class="col">calculateAsteroidMiningResourceExtractionDuration</div>
      <div>{{ calculateAsteroidMiningResourceExtractionDuration }}</div>
    </div>
    <div class="row">
      <div class="col">calculateAsteroidMiningResourceExtractionDuration</div>
      <div>{{ calculateAsteroidMiningAmmoDuration }}</div>
    </div>
    <div class="row">
      <div class="col">calculateAsteroidMiningFoodDuration</div>
      <div>{{ calculateAsteroidMiningFoodDuration }}</div>
    </div>

    <div class="row">
      <div class="col">calculateAsteroidMiningFoodToConsume</div>
      <div>{{ calculateAsteroidMiningFoodToConsume }}</div>
    </div>

    <div v-for="(data, index) in Object.keys(miningData)" v-if="miningData" class="row">
      <div class="col">{{ data }}</div>
      <div v-if="data.includes('Duration')">
        {{ formatTimeSpan(miningData[data].toFixed(1) * 1000) }}
      </div>
      <div v-else-if="data.includes('timeRemaining')">
        {{ formatTimeSpan(miningData[data].toFixed(1) * 1000) }}
      </div>
      <div v-else>{{ miningData[data].toFixed(1) }}</div>
    </div>
  </div>

  <div>
    {{ remaining }}

    {{ usePlayerStore().fleets[0].state.MineAsteroid.lastUpdate }}
  </div>
</template>

<style scoped></style>
