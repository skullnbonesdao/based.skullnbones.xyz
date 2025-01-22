<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useTokenStore } from 'stores/tokenStore'
import TokenTable from 'components/portal/TokenTable.vue'
import FleetShipAddAction from 'components/fleet/actions/FleetShipAddAction.vue'
import { PublicKey } from '@solana/web3.js'
import FleetShipRemoveAction from 'components/fleet/actions/FleetShipRemoveAction.vue'

const showDialog = ref(false)
const tabAction = ref('add')

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

watch(
  () => showDialog.value,
  () => {
    useTokenStore().gameTokenAccountsSelected = undefined
  },
)
</script>

<template>
  <q-btn color="secondary" label="Ships" @click="showDialog = true" />

  <q-dialog v-model="showDialog" full-width transition-hide="rotate" transition-show="rotate">
    <q-card bordered flat>
      <q-card-section class="row q-gutter-x-sm items-center">
        <div class="text-h6">[Ships]</div>
        <div class="text-h5">{{ props.name }}</div>
      </q-card-section>

      <q-separator />

      <q-tabs v-model="tabAction" active-bg-color="primary" align="justify" inline-label>
        <q-tab label="Add" name="add"></q-tab>
        <q-tab label="Remove" name="remove"></q-tab>
      </q-tabs>
      <q-separator />

      <q-card-section>
        <TokenTable
          v-if="tabAction === 'add' && useTokenStore().walletTokenAccounts"
          :rows="useTokenStore().gameTokenAccounts?.filter((acc) => acc.itemType == 'ship')!"
          item-type="ship"
          selection="multiple"
        />
      </q-card-section>

      <q-card-section class="row">
        <q-space />
        <FleetShipAddAction v-if="tabAction == 'add'" :fleet="fleet" />
        <FleetShipRemoveAction v-if="tabAction == 'remove'" :fleet="fleet" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
