<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useTokenStore } from 'stores/tokenStore'
import TokenTable from 'components/portal/TokenTable.vue'
import FleetShipAddAction from 'components/fleet/actions/FleetShipAddAction.vue'
import { PublicKey } from '@solana/web3.js'
import FleetShipDisbandAction from 'components/fleet/actions/FleetShipDisbandAction.vue'
import HeaderBanner2 from 'components/general/HeaderBanner2.vue'
import { usePlayerStore } from 'stores/playerStore'

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
  async () => {
    await usePlayerStore().updateStore()
    usePlayerStore().starbaseTokenAccountsSelected = undefined
  },
)
</script>

<template>
  <q-btn color="primary" icon="workspaces" @click="showDialog = true">
    <q-tooltip>Fleet</q-tooltip>
  </q-btn>

  <q-dialog v-model="showDialog" full-width transition-hide="rotate" transition-show="rotate">
    <q-card bordered flat>
      <HeaderBanner2 :caption="props.name" :text="'Fleet '" />

      <q-separator />

      <q-tabs v-model="tabAction" active-bg-color="primary" align="justify" inline-label>
        <q-tab label="Add" name="add"></q-tab>
        <q-tab label="Disband" name="disband"></q-tab>
      </q-tabs>
      <q-separator />

      <q-card-section>
        <TokenTable
          v-if="tabAction === 'add' && useTokenStore().walletTokenAccounts"
          :rows="usePlayerStore().starbaseTokenAccounts?.filter((acc) => acc.itemType == 'ship')!"
          item-type="ship"
          selection="multiple"
        />
      </q-card-section>

      <q-card-section class="row">
        <q-space />
        <FleetShipAddAction v-if="tabAction == 'add'" :fleet="fleet" />
        <FleetShipDisbandAction v-if="tabAction == 'disband'" :fleet="fleet" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="scss"></style>
