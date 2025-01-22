<script lang="ts" setup>
import { ref } from 'vue'
import { useTokenStore } from 'stores/tokenStore'
import TokenTable from 'components/portal/TokenTable.vue'
import { PublicKey } from '@solana/web3.js'
import FleetCargoLoadAction from 'components/fleet/actions/FleetCargoLoadAction.vue'

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
  <q-btn color="secondary" label="Cargo" @click="showDialog = true" />

  <q-dialog v-model="showDialog" full-width transition-hide="rotate" transition-show="rotate">
    <q-card bordered flat>
      <q-card-section class="row q-gutter-x-sm items-center">
        <div class="text-h6">[Cargo]</div>
        <div class="text-h5">{{ props.name }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="row">
        <q-space />
        <FleetCargoLoadAction :fleet="fleet" />
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
