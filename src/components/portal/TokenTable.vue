<script lang="ts" setup>
import type { TokenAccount } from 'stores/tokenStore'
import TokenDeposit from 'components/portal/TokenDeposit.vue'
import AmountFormatter from 'components/formatter/AmountFormatter.vue'
import { ref } from 'vue'
import TokenWithdraw from 'components/portal/TokenWithdraw.vue'

const props = defineProps(['rows', 'itemType', 'direction'])
const filter = ref()

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
    :filter="filter"
    :pagination="{
      rowsPerPage: 0,
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

        <TokenDeposit
          v-else-if="props.col.name == 'action' && direction == 'deposit'"
          :amount="props.row.uiAmountSelected * Math.pow(10, -props.row.decimals)"
          :item-type="itemType"
          :mint="props.row.mint"
        ></TokenDeposit>

        <TokenWithdraw
          v-else-if="props.col.name == 'action' && direction == 'withdraw'"
          :amount="props.row.uiAmountSelected * Math.pow(10, -props.row.decimals)"
          :item-type="itemType"
          :mint="props.row.mint"
        ></TokenWithdraw>

        <div v-else>{{ props.row[props.col.name] }}</div>
      </q-td>
    </template>
  </q-table>
</template>

<style scoped></style>
