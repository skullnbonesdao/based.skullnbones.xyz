<script lang="ts" setup>
import { TokenAccount } from 'stores/tokenStore'
import DepositResource from 'components/portal/DepositResource.vue'
import AmountFormatter from 'components/formatter/AmountFormatter.vue'

const props = defineProps(['rows'])

const columns = [
  {
    name: 'symbol',
    required: true,
    label: 'Symbol',
    align: 'left',
    field: (row: TokenAccount) => row.symbol,
    sortable: true,
  },
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: (row: TokenAccount) => row.name,
    sortable: true,
  },
  {
    name: 'uiAmount',
    required: true,
    label: 'Available',
    align: 'right',
    field: (row: TokenAccount) => row.uiAmount,
    sortable: true,
  },
  {
    name: 'uiAmountSelected',
    required: true,
    label: 'Amount selected',
    align: 'right',
    field: (row: TokenAccount) => row.uiAmountSelected,
    sortable: false,
  },
  {
    name: 'action',
    required: true,
    label: 'Action',
    align: 'right',
    field: (row: TokenAccount) => row.uiAmountSelected,
    sortable: false,
  },
]
</script>

<template>
  <q-table
    :columns="columns"
    :pagination="{
      rowsPerPage: 0,
    }"
    :rows="rows"
    bordered
    flat
    hide-bottom
    row-key="name"
  >
    <template v-slot:body-cell="props">
      <q-td :props="props">
        <q-input
          v-if="props.col.name == 'uiAmountSelected'"
          v-model.number="props.row[props.col.name]"
          dense
          input-class="text-right"
          standout
          type="number"
        />
        <AmountFormatter
          v-else-if="props.col.name == 'uiAmount'"
          :number="props.row[props.col.name]"
          decimals="1"
          pad-start="10"
        />

        <DepositResource
          v-else-if="props.col.name == 'action'"
          :amount="props.row.uiAmountSelected * Math.pow(10, -props.row.decimals)"
          :mint="props.row.mint"
        ></DepositResource>
        <div v-else>{{ props.row[props.col.name] }}</div>
      </q-td>
    </template>
  </q-table>
</template>

<style scoped></style>
