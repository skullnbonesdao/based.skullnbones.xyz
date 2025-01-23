<script lang="ts" setup>
import { TokenAccountInfo, useTokenStore } from 'stores/tokenStore'
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
    style: 'width: 10px',
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

const remainingFuelCapacity = computed(() => {
  const cargoUsed = usePlayerStore()?.fleetFuelAccount?.uiAmount
  return (
    usePlayerStore().fleets?.find((f) => f.key.toString() == globalProps.fleet.toString())?.data
      .stats.cargoStats.fuelCapacity - (cargoUsed ?? 0)
  )
})

const remainingAmmoCapacity = computed(() => {
  const cargoUsed = usePlayerStore()?.fleetAmmoAccount?.uiAmount
  return (
    usePlayerStore().fleets?.find((f) => f.key.toString() == globalProps.fleet.toString())?.data
      .stats.cargoStats.ammoCapacity - (cargoUsed ?? 0)
  )
})

const remainingCargoCapacity = computed(() => {
  const cargoUsed = usePlayerStore()
    ?.fleetCargoAccounts?.flatMap((fCA) => fCA.uiAmount)
    ?.reduce((partialSum, b) => partialSum + b, 0)

  return (
    usePlayerStore().fleets?.find((f) => f.key.toString() == globalProps.fleet.toString())?.data
      .stats.cargoStats.cargoCapacity - (cargoUsed ?? 0)
  )
})

function getCapacity(mint: PublicKey) {
  switch (useTokenStore().tokenList.find((t) => t.mint.toString() == mint.toString())?.symbol) {
    case 'FUEL':
      return usePlayerStore().fleets?.find((f) => f.key.toString() == globalProps.fleet.toString())
        ?.data.stats.cargoStats.fuelCapacity
    case 'AMMO':
      return usePlayerStore().fleets?.find((f) => f.key.toString() == globalProps.fleet.toString())
        ?.data.stats.cargoStats.ammoCapacity
    default:
      return usePlayerStore().fleets?.find((f) => f.key.toString() == globalProps.fleet.toString())
        ?.data.stats.cargoStats.cargoCapacity
  }
}

function getRemainingCapacity(mint: PublicKey) {
  switch (useTokenStore().tokenList.find((t) => t.mint.toString() == mint.toString())?.symbol) {
    case 'FUEL':
      return remainingFuelCapacity.value
    case 'AMMO':
      return remainingAmmoCapacity.value
    default:
      return remainingCargoCapacity.value
  }
}

function getCargoAmount(mint: PublicKey) {
  switch (useTokenStore().tokenList.find((t) => t.mint.toString() == mint.toString())?.symbol) {
    case 'FUEL':
      return usePlayerStore().fleetFuelAccount?.uiAmount || 0
    case 'AMMO':
      return usePlayerStore().fleetAmmoAccount?.uiAmount || 0
    default:
      return (
        usePlayerStore().fleetCargoAccounts?.find((fCA) => fCA.mint.toString() == mint.toString())
          ?.uiAmount || 0
      )
  }
}
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
    :rows="globalProps.rows"
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
      <q-input v-model="filter" borderless debounce="300" dense placeholder="Search">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>

    <template v-slot:body="props">
      <q-tr :props="props" @click="props.expand = !props.expand">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <div v-if="col.name == 'extend'" class="col row">
            <q-btn class="" color="primary" icon="expand"></q-btn>
          </div>

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
              <div class="col">
                {{
                  ((getCargoAmount(props.row.mint) / getCapacity(props.row.mint)) * 100).toFixed(0)
                }}%
              </div>

              <AmountFormatter
                :number="getCargoAmount(props.row.mint)"
                :url="props.row.thumbnailUrl"
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
        <q-td class="" colspan="100%">
          <div class="row q-gutter-x-sm">
            <div class="col">
              <div class="row items-center">
                <div class="col row items-center">
                  <div class="col row items-center">
                    <div class="text-subtitle2">@Starbase</div>

                    <q-slider
                      v-model="props.row.uiAmountChange"
                      :max="getRemainingCapacity(props.row.mint)"
                      :min="-props.row.uiAmount"
                      :step="1"
                      class="col q-mx-md"
                      color="accent"
                      label
                    />
                    <div class="text-subtitle2">@Cargo</div>
                  </div>
                </div>
              </div>
              <q-input
                v-model="props.row.uiAmountChange"
                class="col"
                dense
                standout
                type="number"
              />
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
