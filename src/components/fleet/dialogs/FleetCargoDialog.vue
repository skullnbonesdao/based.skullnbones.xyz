<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { PublicKey } from '@solana/web3.js'
import HeaderBanner from 'components/general/HeaderBanner.vue'
import { usePlayerStore } from 'stores/playerStore'
import CargoTable from 'components/fleet/views/CargoTable.vue'

const showDialog = ref(false)

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
  return usePlayerStore().fleets.find((fleet) => fleet.key == props.fleet)
})

watch(
  () => showDialog.value,
  async () => {
    await usePlayerStore().updateFleetCargoAccounts(props.fleet)
    usePlayerStore().starbaseTokenAccountsSelected = undefined
  },
)
</script>

<template>
  <q-btn color="secondary" label="Edit Cargo" @click="showDialog = true" />

  <q-dialog v-model="showDialog" full-width transition-hide="rotate" transition-show="rotate">
    <q-card bordered flat>
      <HeaderBanner text="Cargo" />

      <q-separator />
      <q-expansion-item
        caption="Consumed Resources"
        default-opened
        expand-separator
        icon="perm_identity"
        label="Fleet Provision"
      >
        <CargoTable
          v-if="usePlayerStore().fleetFilteredConsumptionAccounts"
          :fleet="props.fleet"
          :rows="usePlayerStore().fleetFilteredConsumptionAccounts!"
          action="sync"
          class="bg-primary"
        />
      </q-expansion-item>

      <q-separator style="height: 10px" />

      <q-expansion-item
        caption="Cargo fleet storage"
        default-opened
        expand-separator
        icon="perm_identity"
        label="Fleet Cargo"
      >
        <CargoTable
          v-if="usePlayerStore().fleetFilteredCargoAccounts"
          :fleet="props.fleet"
          :rows="usePlayerStore().fleetFilteredCargoAccounts!"
          action="sync"
          class="bg-primary"
        />
      </q-expansion-item>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
