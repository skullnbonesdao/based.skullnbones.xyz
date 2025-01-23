<script lang="ts" setup>
import { TokenAccountInfo, useTokenStore } from 'stores/tokenStore'
import AmountFormatter from 'components/formatter/AmountFormatter.vue'
import { type PropType, ref } from 'vue'
import FleetCargoSyncAction from 'components/fleet/actions/FleetCargoSyncAction.vue'
import { PublicKey } from '@solana/web3.js'

const globalProps = defineProps({
  fleet: { type: PublicKey, required: true },
  rows: {
    type: {} as PropType<TokenAccountInfo[]>,
    required: true,
  },
  action: {
    type: String,
  },
})

const filter = ref()

const columns = ref([
  {
    name: 'symbol',
    required: true,
    label: 'Symbol',
    align: 'left',
    field: (row: TokenAccountInfo) => row?.symbol,
    sortable: true,
  },
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: (row: TokenAccountInfo) => row?.name,
    sortable: true,
  },
  {
    name: 'uiAmount',
    required: true,
    label: 'Quantity',
    align: 'right',
    field: (row: TokenAccountInfo) => row.uiAmount,
    sortable: true,
  },
])

if (globalProps.action)
  columns.value.push({
    name: 'action',
    required: true,
    label: 'Action',
    align: 'right',
    field: (row: TokenAccountInfo) => row.uiAmountSelected,
    sortable: false,
  })
</script>

<template>
  {{ useTokenStore().gameTokenAccounts }}

  <q-table
    v-if="globalProps.rows"
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

    <template v-slot:body-cell="props">
      <q-td :props="props">
        <div v-if="props.col.name == 'uiAmount'" class="col">
          <div class="row items-center">
            <div class="col-1">@Starbase</div>

            <!--            <AmountFormatter
                          :number="
                            useTokenStore().gameTokenAccounts?.find(
                              (t) => t.mint.toString() == props.row.mint.toString(),
                            )
                          "
                          :url="props.row['thumbnailUrl']"
                          class="col"
                          decimals="1"
                          pad-start="10"
                        />-->
          </div>
          <div class="row items-center">
            <div>@Cargo</div>
            <AmountFormatter
              :number="props.row[props.col.name]"
              :url="props.row['thumbnailUrl']"
              class="col"
              decimals="1"
              pad-start="10"
            />
          </div>
        </div>

        <FleetCargoSyncAction
          v-else-if="props.col.name == 'action' && action == 'sync'"
          :cargo-mint="props.row.mint"
          :fleet="globalProps.fleet"
          :is-amount="0"
          :should-amount="0"
        ></FleetCargoSyncAction>

        <div v-else>{{ props.row[props.col.name] }}</div>
      </q-td>
    </template>
  </q-table>
</template>

<style scoped></style>
