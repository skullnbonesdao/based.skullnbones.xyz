<script lang="ts" setup>
import { TokenAccount } from 'stores/tokenStore'
import { type PropType, ref } from 'vue'
import { Fleet } from '@staratlas/sage'
import { byteArrayToString } from '@staratlas/data-source'
import FleetAddShipDialog from 'components/fleet/dialogs/FleetAddShipDialog.vue'

const props = defineProps({
  rows: {
    type: {} as PropType<TokenAccount[]>,
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
    name: 'actions',
    required: false,
    label: 'Actions',
    align: 'left',
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
      <q-input v-model="filter" borderless debounce="300" dense placeholder="Search">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
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
          <div v-if="col.name == 'actions'">
            <FleetAddShipDialog :fleet="props.row.key" />
          </div>
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
