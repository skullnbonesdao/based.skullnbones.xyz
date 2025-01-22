<script lang="ts" setup>
import { ref } from 'vue'
import { useTokenStore } from 'stores/tokenStore'
import TokenTable from 'components/portal/TokenTable.vue'
import FleetAddShipAction from 'components/fleet/actions/FleetAddShipAction.vue'
import { PublicKey } from '@solana/web3.js'

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
</script>

<template>
  <q-btn color="primary" label="Add Ships" @click="showDialog = true" />

  <q-dialog v-model="showDialog" full-width transition-hide="rotate" transition-show="rotate">
    <q-card bordered flat>
      <q-card-section>
        <div class="text-h6">Add ships to fleet {{ props.name }}</div>
      </q-card-section>

      <q-card-section class="row">
        <q-space />

        <FleetAddShipAction :fleet="fleet" />
      </q-card-section>

      <q-card-section>
        <TokenTable
          v-if="useTokenStore().walletTokenAccounts"
          :rows="useTokenStore().gameTokenAccounts?.filter((acc) => acc.itemType == 'ship')!"
          item-type="ship"
          selection="multiple"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-close-popup color="primary" flat label="Decline" />
        <q-btn v-close-popup color="primary" flat label="Accept" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped></style>
