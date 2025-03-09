<script lang="ts" setup>
import { TokenAccount } from 'stores/tokenStore'
import AmountFormatter from 'components/formatter/AmountFormatter.vue'
import { type PropType, ref } from 'vue'
import { usePlayerStore } from 'stores/playerStore'
import TokenDepositWithdrawAction from 'components/portal/actions/TokenDepositWithdrawAction.vue'

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
    type: {} as PropType<'single' | 'multiple' | 'none' | undefined>,
    default: undefined,
  },
})

const filter = ref()

const columns = ref([
  {
    name: 'symbol',
    label: 'Symbol',
    align: 'left',
    field: (row: TokenAccount) => row.symbol,
    sortable: true,
  },
  {
    name: 'icon',
    label: '',
    align: 'left',
    field: (row: TokenAccount) => row.symbol,
    sortable: false,
    style: 'width: 5px',
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

    label: 'Available',
    align: 'right',
    field: (row: TokenAccount) => row.uiAmount,
    sortable: true,
  },
  {
    name: 'uiAmountSelected',
    label: 'Selected',
    align: 'right',
    field: (row: TokenAccount) => row.uiAmountSelected,
    sortable: false,
  },
])

if (props.action)
  columns.value.push({
    name: 'action',
    label: 'Action',
    align: 'right',
    field: (row: TokenAccount) => row.uiAmountSelected,
    sortable: false,
  })
</script>

<template>
  <q-table
    v-if="props.rows"
    v-model:selected="usePlayerStore().starbaseTokenAccountsSelected"
    :columns="columns"
    :filter="filter"
    :pagination="{
      rowsPerPage: 0,
      sortBy: 'name',
      descending: false,
    }"
    :rows="rows"
    :selection="selection"
    dense
    flat
    hide-bottom
    row-key="name"
    square
  >
    <template v-slot:top-left>
      <div class="text-grey-5">Found {{ rows.length }} Items</div>
    </template>
    <template v-slot:top-right>
      <q-input v-model="filter" debounce="300" dense placeholder="Search" standout>
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

    <template v-slot:body-cell="props">
      <q-td :props="props">
        <div v-if="props.col.name == 'icon'">
          <q-avatar size="md">
            <q-img :src="`${props.row['thumbnailUrl']}`" />
          </q-avatar>
        </div>

        <div v-else-if="props.col.name == 'uiAmount'">
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

        <TokenDepositWithdrawAction
          v-else-if="props.col.name == 'action'"
          :direction="action"
          :item-type="itemType"
        />

        <div v-else>{{ props.row[props.col.name] }}</div>
      </q-td>
    </template>
  </q-table>
</template>

<style scoped></style>
