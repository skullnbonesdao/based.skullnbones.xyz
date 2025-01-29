<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { usePlayerStore } from 'stores/playerStore'
import { Fleet } from '@staratlas/sage'
import { useGameStore } from 'stores/gameStore'
import { useTokenStore } from 'stores/tokenStore'
import { calculateMiningResults } from 'src/handler/interfaces/FleetInterface'
import { getAccount, getAssociatedTokenAddressSync } from '@solana/spl-token'
import { useRPCStore } from 'stores/rpcStore'
import { formatTimeSpan } from 'components/formatter/formatTimespan'

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

const miningData = computed(() => {
  if (!fleetAmmoTokenBefore.value) return 0
  if (!fleetFoodTokenBefore.value) return 0
  const fleet = usePlayerStore().fleets![0]! as Fleet

  if (!fleet.state.MineAsteroid) return 'Fleet not mining...'

  console.log(fleet.state.MineAsteroid.resource)

  const mineItem = useGameStore().mineItems?.find(
    (m) => m.data.mint.toString() == useTokenStore().getTokenBySymbol('HYG').toString(),
  )
  const resource = useGameStore().resources?.find(
    (r) => r.key.toString() == fleet.state.MineAsteroid?.resource.toString(),
  )
  console.log('mineItem', mineItem)
  console.log('resource', resource)

  const penalty = 0

  return calculateMiningResults(
    fleet,
    fleetFoodTokenBefore.value,
    fleetAmmoTokenBefore.value,
    mineItem.data,
    resource.data,
    penalty,
  )
})

const remaining = ref(Date.now())

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

  const temp =
    usePlayerStore().fleets[0].state.MineAsteroid?.lastUpdate -
    Date.now() / 1000 +
    calculateAsteroidMiningResourceExtractionDuration.value
  remaining.value = formatTimeSpan(temp * 1000)

  console.log(temp)
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
  </div>

  <div>
    {{ remaining }}
    {{ miningData }}
  </div>
</template>

<style scoped></style>
