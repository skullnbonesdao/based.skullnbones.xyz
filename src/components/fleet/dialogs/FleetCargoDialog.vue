<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useTokenStore } from 'stores/tokenStore'
import { PublicKey } from '@solana/web3.js'

import { useGameStore } from 'stores/gameStore'
import FleetCargoLoadAction from 'components/fleet/actions/FleetCargoLoadAction.vue'
import HeaderBanner from 'components/general/HeaderBanner.vue'
import CargoTable from 'components/fleet/views/CargoTable.vue'

const showDialog = ref(false)
const expanded = ref(false)
const props = defineProps({
  name: {
    type: String,
    default: 'none',
  },
  fleet: {
    type: PublicKey,
    required: true,
  },
})

const fleetData = computed(() => {
  return useGameStore().fleets.find((fleet) => fleet.key == props.fleet)
})

watch(
  () => showDialog.value,
  async () => {
    await useTokenStore().updateFleetCargoAccounts(props.fleet)
    useTokenStore().gameTokenAccountsSelected = undefined
  },
)
</script>

<template>
  <q-btn color="secondary" label="Cargo" @click="showDialog = true" />

  <q-dialog v-model="showDialog" full-width transition-hide="rotate" transition-show="rotate">
    <q-card bordered flat>
      <HeaderBanner text="Cargo" />

      <q-separator />

      <q-card-section class="row q-gutter-x-sm">
        <q-card bordered class="col" flat>
          <q-card-section>FUEL</q-card-section>
          <q-card-section>
            <FleetCargoLoadAction
              :fleet="props.fleet"
              :init-amount="fleetData?.data.stats.cargoStats.fuelCapacity"
              cargo-type="FUEL"
            />
          </q-card-section>
        </q-card>

        <q-card bordered class="col" flat>
          <q-card-section>AMMO</q-card-section>
          <q-card-section>
            <FleetCargoLoadAction
              :fleet="props.fleet"
              :init-amount="fleetData?.data.stats.cargoStats.ammoCapacity"
              cargo-type="AMMO"
            />
          </q-card-section>
        </q-card>
      </q-card-section>

      <q-card-section class="row q-gutter-x-sm">
        <q-card bordered class="col" flat>
          <q-card-section>FOOD</q-card-section>
          <q-card-section>
            <FleetCargoLoadAction
              :fleet="props.fleet"
              :init-amount="fleetData?.data.stats.cargoStats.cargoCapacity"
              cargo-type="FOOD"
            />
          </q-card-section>
        </q-card>

        <q-card bordered class="col" flat>
          <q-card-section>TOOL</q-card-section>
          <q-card-section>
            <FleetCargoLoadAction
              :fleet="props.fleet"
              :init-amount="fleetData?.data.stats.cargoStats.cargoCapacity"
              cargo-type="TOOL"
            />
          </q-card-section>
        </q-card>
      </q-card-section>

      <q-card-section>
        <CargoTable
          v-if="useTokenStore().fleetCargoAccounts"
          :rows="useTokenStore().fleetCargoAccounts"
          action="sync"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
