<script lang="ts" setup>
import { TokenAccountInfo } from 'stores/tokenStore'
import { onMounted, type PropType, ref } from 'vue'
import { Fleet } from '@staratlas/sage'
import { byteArrayToString, readFromRPC } from '@staratlas/data-source'
import { usePlayerStore } from 'stores/playerStore'
import { useRPCStore } from 'stores/rpcStore'
import { useWorkspaceAdapter } from 'src/handler/connector'
import { PublicKey } from '@solana/web3.js'
import { FleetShips } from '@staratlas/sage/src'
import FleetTableRrow from 'components/fleet/views/FleetTableRrow.vue'

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
    name: 'info',
    required: false,
    label: 'Sate info',
    align: 'left',
    sortable: false,
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
  <!--  <MiningResultsDisplay v-if="usePlayerStore().fleets[0]?.state.MineAsteroid" />-->
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
          <FleetTableRrow :col="col" :row="props.row" />
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
