<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useTokenStore } from 'stores/tokenStore'
import { PublicKey } from '@solana/web3.js'
import FleetCargoLoadAction from 'components/fleet/actions/FleetCargoLoadAction.vue'
import { useGameStore } from 'stores/gameStore'

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
  () => {
    useTokenStore().gameTokenAccountsSelected = undefined
  },
)
</script>

<template>
  <q-btn color="secondary" label="Cargo" @click="showDialog = true" />

  <q-dialog v-model="showDialog" full-width transition-hide="rotate" transition-show="rotate">
    <q-card bordered flat>
      <q-card-section class="row q-gutter-x-sm items-center">
        <div class="text-h6">[Cargo]</div>
        <div class="text-h5">{{ props.name }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="row q-gutter-x-sm">
        <q-card>
          <q-card-section> FUEL</q-card-section>
          <q-card-section>
            <FleetCargoLoadAction
              :fleet="props.fleet"
              :init-amount="fleetData?.data.stats.cargoStats.fuelCapacity"
              cargo-type="FUEL"
            />
          </q-card-section>
        </q-card>

        <q-card>
          <q-card-section> AMMO</q-card-section>
          <q-card-section>
            <FleetCargoLoadAction
              :fleet="props.fleet"
              :init-amount="fleetData?.data.stats.cargoStats.ammoCapacity"
              cargo-type="AMMO"
            />
          </q-card-section>
        </q-card>
      </q-card-section>

      <!--      <q-card-section>
              <TokenTable
                v-if="useTokenStore().walletTokenAccounts"
                :rows="useTokenStore().gameTokenAccounts?.filter((acc) => acc.itemType == 'resource')!"
                item-type="ship"
                selection="multiple"
              />
            </q-card-section>-->
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
