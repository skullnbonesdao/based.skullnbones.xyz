<script lang="ts" setup>
import { TokenAccountInfo, useTokenStore } from 'stores/tokenStore'
import { computed, onMounted, type PropType, ref } from 'vue'
import { Fleet } from '@staratlas/sage'
import { byteArrayToString, readFromRPC } from '@staratlas/data-source'
import FleetShipDialog from 'components/fleet/dialogs/FleetShipDialog.vue'
import FleetCargoDialog from 'components/fleet/dialogs/FleetCargoDialog.vue'
import FleetDockAction from 'components/fleet/actions/FleetDockAction.vue'
import FleetStartMiningAction from 'components/fleet/actions/FleetStartMiningAction.vue'
import FleetStopMiningAction from 'components/fleet/actions/FleetStopMiningAction.vue'
import { usePlayerStore } from 'stores/playerStore'
import FleetCargoElement from 'components/fleet/elements/FleetCargoElement.vue'
import { calculateMiningResults } from 'src/handler/interfaces/FleetInterface'
import { getAccount, getAssociatedTokenAddressSync } from '@solana/spl-token'
import { useRPCStore } from 'stores/rpcStore'
import { useGameStore } from 'stores/gameStore'
import FleetUndockAction from 'components/fleet/actions/FleetUndockAction.vue'
import { useWorkspaceAdapter } from 'src/handler/connector'
import { PublicKey } from '@solana/web3.js'
import { FleetShips } from '@staratlas/sage/src'
import { date } from 'quasar'
import { formatTimeSpan } from 'components/formatter/formatTimespan'

const props = defineProps({
  rows: {
    type: {} as PropType<TokenAccountInfo[]>,
    required: true,
  },
})

const filter = ref()

onMounted(async () => {
  console.log(
    await readFromRPC(
      useRPCStore().connection,
      useWorkspaceAdapter()?.sageProgram.value,
      new PublicKey('GzTQjbRfw3VcBsu2YEqhkHrZn9yBtzJxGBtwVimxvGeg'),
      FleetShips,
    ),
  )
})

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

setInterval(() => {
  const fleet = usePlayerStore().fleets![0]! as Fleet

  const mineItem = useGameStore().mineItems?.find(
    (m) => m.data.mint.toString() == useTokenStore().getTokenBySymbol('HYG').toString(),
  )
  const resource = useGameStore().resources?.find(
    (r) => r.key.toString() == fleet.state.MineAsteroid?.resource.toString(),
  )

  const timeResource = Fleet.calculateAsteroidMiningResourceExtractionDuration(
    usePlayerStore().fleets[0]!.data.stats,
    mineItem.data,
    resource.data,
    10963 - 304,
  )
  console.log(timeResource)

  const temp =
    usePlayerStore().fleets[0].state.MineAsteroid?.lastUpdate - Date.now() / 1000 + timeResource
  remaining.value = formatTimeSpan(temp * 1000)
}, 1000)

const columns = ref([
  {
    name: 'extend',
    required: true,
    align: 'left',
    sortable: false,
  },
  {
    name: 'fleetLabel',
    required: true,
    label: 'Fleet name',
    align: 'left',
    field: (row: Fleet) => byteArrayToString(row.data.fleetLabel),
    sortable: true,
  },
  {
    name: 'state',
    required: true,
    label: 'State',
    align: 'left',
    field: (row: Fleet) =>
      Object.keys(row.state)[0] == 'MineAsteroid' ? 'MineAsteroid' : Object.keys(row.state)[0],
    sortable: true,
  },
  {
    name: 'fuel',
    required: true,
    label: 'Fuel',
    align: 'center',
    field: (row: Fleet) => row.data.fuelTank,
    sortable: true,
  },
  {
    name: 'ammo',
    required: true,
    label: 'Ammo',
    align: 'center',
    field: (row: Fleet) => row.data.ammoBank,
    sortable: true,
  },
  {
    name: 'cargo',
    required: true,
    label: 'Cargo',
    align: 'center',
    field: (row: Fleet) => row.data.ammoBank,
    sortable: true,
  },

  {
    name: 'actions',
    required: false,
    label: 'Actions',
    align: 'right',
    sortable: false,
  },
])
</script>

<template>
  {{ remaining }}
  {{
    date.formatDate(
      usePlayerStore().fleets[0].state.MineAsteroid?.lastUpdate * 1000,
      'YYYY-MM-DDTHH:mm:ss.SSSZ',
    )
  }}

  {{ miningData }}
  <q-table
    v-if="props.rows"
    :columns="columns"
    :filter="filter"
    :pagination="{
      rowsPerPage: 0,
      sortBy: 'name',
      descending: true,
    }"
    :rows="rows"
    flat
    hide-bottom
    row-key="name"
    square
  >
    <template v-slot:top-left>
      <div class="text-grey-5">Found {{ rows.length }} Items</div>
    </template>
    <template v-slot:top-right>
      <q-btn-group>
        <q-input v-model="filter" debounce="300" dense placeholder="Search" standout>
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          color="primary"
          icon="refresh"
          square
          @click="usePlayerStore().updateFleet()"
        ></q-btn>
      </q-btn-group>
    </template>

    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th auto-width />
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>

    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td auto-width>
          <q-btn
            :icon="props.expand ? 'remove' : 'add'"
            color="accent"
            dense
            round
            size="sm"
            @click="props.expand = !props.expand"
          />
        </q-td>

        <q-td v-for="col in props.cols" :key="col.name" :props="props">
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
            <FleetUndockAction
              v-if="props.row.state['StarbaseLoadingBay']"
              :fleet="props.row.key"
            />

            <FleetStartMiningAction v-if="props.row.state['Idle']" :fleet="props.row.key" />
            <FleetStopMiningAction v-if="props.row.state['MineAsteroid']" :fleet="props.row.key" />
          </q-btn-group>
          <FleetCargoElement
            v-else-if="col.name == 'fuel'"
            :fleet="props.row.key.toString()"
            symbol="FUEL"
          />
          <FleetCargoElement
            v-else-if="col.name == 'ammo'"
            :fleet="props.row.key.toString()"
            symbol="AMMO"
          />
          <FleetCargoElement
            v-else-if="col.name == 'cargo'"
            :fleet="props.row.key.toString()"
            symbol="CARGO"
          />
          <div v-else>
            {{ col.value }}
          </div>
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <div></div>
          <div class="text-left">{{ JSON.stringify(props.row, null, 2) }}.</div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<style scoped></style>
