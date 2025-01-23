<script lang="ts" setup>
import { TokenAccountInfo } from 'stores/tokenStore'
import AmountFormatter from 'components/formatter/AmountFormatter.vue'
import { computed, type PropType, ref } from 'vue'
import FleetCargoSyncAction from 'components/fleet/actions/FleetCargoSyncAction.vue'
import { PublicKey } from '@solana/web3.js'
import { usePlayerStore } from '../../../stores/playerStore'

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
    name: 'extend',
    required: true,
    align: 'left',
    sortable: false,
  },
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

const remainingCapacity = computed(() => {
  const cargoUsed = usePlayerStore()
    .fleetCargoAccounts?.flatMap((fCA) => fCA.uiAmount)
    .reduce((a, b) => a + b)
  return (
    usePlayerStore().fleets?.find((f) => f.key.toString() == globalProps.fleet.toString())?.data
      .stats.cargoStats.cargoCapacity - (cargoUsed ?? 0)
  )
})
</script>

<template>
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

    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <q-td v-if="col.name == 'extend'" class="row">
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
          </q-td>

          <div v-else-if="col.name == 'uiAmount'" class="col">
            <div class="row items-center">
              <div class="col-1">@Starbase</div>

              <AmountFormatter
                :number="
                  usePlayerStore().starbaseTokenAccounts?.find(
                    (t) => t.mint.toString() == props.row.mint.toString(),
                  )?.uiAmount ?? 0
                "
                :url="props.row['thumbnailUrl']"
                class="col"
                decimals="1"
                pad-start="10"
              />
            </div>
            <div class="row items-center">
              <div>@Cargo</div>
              <AmountFormatter
                :number="props.row['uiAmount']"
                :url="props.row['thumbnailUrl']"
                class="col"
                decimals="1"
                pad-start="10"
              />
            </div>
          </div>

          <FleetCargoSyncAction
            v-else-if="col.name == 'action' && action == 'sync'"
            :cargo-mint="props.row.mint"
            :fleet="globalProps.fleet"
            :is-amount="0"
            :should-amount="0"
          ></FleetCargoSyncAction>

          <div v-else>
            {{ col.value }}
          </div>
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <div class="row">
            <div class="col">
              <div class="row items-center q-mr-sm">
                <div class="col text-h6">Load/Unload</div>
                <q-input v-model="props.row['uiAmountChange']" dense standout type="number" />
              </div>
              <div class="row items-center">
                <div class="col row items-center q-gutter-x-md">
                  <div class="text-subtitle2">Starbase</div>
                  <q-slider
                    v-model="props.row['uiAmountChange']"
                    :max="remainingCapacity"
                    :min="-props.row['uiAmount']"
                    :step="1"
                    class="col"
                    color="accent"
                    label
                  />
                  <div class="text-subtitle2">Cargo</div>
                </div>
              </div>
            </div>

            <FleetCargoSyncAction
              :amount="props.row['uiAmountChange']"
              :cargo-mint="props.row.mint"
              :fleet="globalProps.fleet"
            />
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<style scoped></style>
