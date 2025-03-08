<script lang="ts" setup>
import { Fleet } from '@staratlas/sage'
import { byteArrayToString } from '@staratlas/data-source'
import { useGameStore } from 'stores/gameStore'
import FleetUndockAction from 'components/fleet/actions/FleetUndockAction.vue'
import FleetStartMiningAction from 'components/fleet/actions/FleetStartMiningAction.vue'
import FleetCargoDialog from 'components/fleet/dialogs/FleetCargoDialog.vue'
import FleetDockAction from 'components/fleet/actions/FleetDockAction.vue'
import FleetShipDialog from 'components/fleet/dialogs/FleetShipDialog.vue'
import FleetStopMiningAction from 'components/fleet/actions/FleetStopMiningAction.vue'
import FleetCargoDisplay from 'components/fleet/displays/FleetCargoDisplay.vue'
import { computed, onMounted, ref } from 'vue'
import { usePlayerStore } from 'stores/playerStore'
import { calculateMiningResults } from 'src/handler/interfaces/FleetInterface'
import { getAccount, getAssociatedTokenAddressSync } from '@solana/spl-token'
import { useRPCStore } from 'stores/rpcStore'
import { useTokenStore } from 'stores/tokenStore'
import { formatTimeSpan } from 'components/formatter/formatTimespan'

const props = defineProps({
  col: {
    type: Object,
    required: true,
  },
  row: {
    type: Fleet,
    required: true,
  },
})

const fleetAmmoTokenBefore = ref<Account>()
const fleetFoodTokenBefore = ref<Account>()
const miningData = ref()
const fleet = ref<Fleet>()
const mineItem = ref()
const resource = ref()

onMounted(async () => {
  fleet.value = usePlayerStore().fleets![0]! as Fleet

  fleetAmmoTokenBefore.value = await getAccount(
    useRPCStore().connection,
    getAssociatedTokenAddressSync(useTokenStore().AMMO, fleet.value.data.ammoBank, true),
    'processed',
  )

  fleetFoodTokenBefore.value = await getAccount(
    useRPCStore().connection,
    getAssociatedTokenAddressSync(useTokenStore().FOOD, fleet.value.data.cargoHold, true),
    'processed',
  )

  mineItem.value = useGameStore().mineItems?.find(
    (m) => m.data.mint.toString() == useTokenStore().getTokenBySymbol('HYG').toString(),
  )

  resource.value = useGameStore().resources?.find(
    (r) => r.key.toString() == fleet.value.state.MineAsteroid?.resource.toString(),
  )
})

setInterval(() => {
  miningData.value = !fleet.value.state.MineAsteroid
    ? 'Fleet not mining'
    : calculateMiningResults(
        fleet.value,
        fleetFoodTokenBefore.value,
        fleetAmmoTokenBefore.value,
        mineItem.value?.data,
        resource.value?.data,
        0,
      )
}, 1000)

const info = computed(() => {
  if (fleet.value?.state.MineAsteroid) {
    return miningData.value?.timeRemaining > 0
      ? formatTimeSpan(miningData.value?.timeRemaining * 1000)
      : 'stopped mining'
  } else {
    return 'nothing'
  }
})
</script>

<template>
  <q-btn-group v-if="col.name == 'actions'" class="">
    <FleetShipDialog
      v-if="props.row.state['StarbaseLoadingBay']"
      :fleet="props.row.key"
      :name="byteArrayToString(props.row.data.fleetLabel)"
    />
    <FleetCargoDialog
      v-if="props.row.state['StarbaseLoadingBay']"
      :fleet="props.row.key"
      :name="byteArrayToString(props.row.data.fleetLabel)"
    />
    <FleetDockAction v-if="props.row.state['Idle']" :fleet="props.row.key" />
    <FleetUndockAction v-if="props.row.state['StarbaseLoadingBay']" :fleet="props.row.key" />

    <FleetStartMiningAction v-if="props.row.state['Idle']" :fleet="props.row.key" />
    <FleetStopMiningAction v-if="props.row.state['MineAsteroid']" :fleet="props.row.key" />
  </q-btn-group>
  <FleetCargoDisplay
    v-else-if="col.name == 'fuel'"
    :fleet="props.row.key.toString()"
    symbol="FUEL"
  />
  <FleetCargoDisplay
    v-else-if="col.name == 'ammo'"
    :fleet="props.row.key.toString()"
    symbol="AMMO"
  />
  <FleetCargoDisplay
    v-else-if="col.name == 'cargo'"
    :fleet="props.row.key.toString()"
    symbol="CARGO"
  />
  <div v-else-if="col.name == 'info'">
    {{ info }}
  </div>

  <div v-else>
    {{ col.value }}
  </div>
</template>

<style scoped></style>
