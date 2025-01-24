<script lang="ts" setup>
import type { TokenAccountInfo } from 'stores/tokenStore'
import { type PropType, ref } from 'vue'
import type { Fleet } from '@staratlas/sage'
import { byteArrayToString } from '@staratlas/data-source'
import FleetShipDialog from 'components/fleet/dialogs/FleetShipDialog.vue'
import FleetCargoDialog from 'components/fleet/dialogs/FleetCargoDialog.vue'
import FleetDockAction from 'components/fleet/actions/FleetDockAction.vue'
import FleetUndockAction from 'components/fleet/actions/FleetUndockAction.vue'
import FleetStartMiningAction from 'components/fleet/actions/FleetStartMiningAction.vue'
import FleetStopMiningAction from 'components/fleet/actions/FleetStopMiningAction.vue'
import { usePlayerStore } from 'stores/playerStore'
import FleetCargoElement from 'components/fleet/elements/FleetCargoElement.vue'

const props = defineProps({
  rows: {
    type: {} as PropType<TokenAccountInfo[]>,
    required: true,
  },
})

const filter = ref()

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
    field: (row: Fleet) => Object.keys(row.state)[0],
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
          <div v-if="col.name == 'actions'" class="row q-gutter-x-sm justify-end">
            {{}}
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
          </div>
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
