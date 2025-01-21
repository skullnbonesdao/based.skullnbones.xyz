<script lang="ts" setup>
import { TokenAccount, useTokenStore } from 'stores/tokenStore'
import TokenDeposit from 'components/portal/TokenDeposit.vue'
import AmountFormatter from 'components/formatter/AmountFormatter.vue'
import { type PropType, ref } from 'vue'
import TokenWithdraw from 'components/portal/TokenWithdraw.vue'

const props = defineProps({
  rows: {
    type: {} as PropType<TokenAccount[]>,
    required: true,
  },
  itemType: {
    type: String,
  },
  action: {
    type: String,
  },
  selection: {
    type: String,
    default: undefined,
  },
})

const filter = ref()

const columns = ref([
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
    label: 'Selected',
    align: 'right',
    field: (row: TokenAccount) => row.uiAmountSelected,
    sortable: false,
  },
])

if (props.action)
  columns.value.push({
    name: 'action',
    required: true,
    label: 'Action',
    align: 'right',
    field: (row: TokenAccount) => row.uiAmountSelected,
    sortable: false,
  })
</script>

<template>
  <q-table
    v-if="props.rows"
    v-model:selected="useTokenStore().gameTokenAccountsSelected"
    :columns="columns"
    :filter="filter"
    :pagination="{
      rowsPerPage: 0,
      sortBy: 'name',
      descending: true,
    }"
    :rows="rows"
    :selection="selection"
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
        <div v-if="props.col.name == 'uiAmount'">
          <AmountFormatter
            :number="props.row[props.col.name]"
            :url="props.row['thumbnailUrl']"
            decimals="1"
            pad-start="10"
          />
        </div>

        <div v-else-if="props.col.name == 'uiAmountSelected'">
          <q-input
            v-model.number="props.row[props.col.name]"
            dense
            input-class="text-right"
            standout
            type="number"
          >
            <template v-slot:append>
              <q-avatar size="xs">
                <q-img :src="`${props.row['thumbnailUrl']}`" />
              </q-avatar>
            </template>
          </q-input>
        </div>

        <TokenDeposit
          v-else-if="props.col.name == 'action' && action == 'deposit'"
          :amount="props.row.uiAmountSelected * Math.pow(10, -props.row.decimals)"
          :item-type="itemType"
          :mint="props.row.mint"
        ></TokenDeposit>

        <TokenWithdraw
          v-else-if="props.col.name == 'action' && action == 'withdraw'"
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
