<script lang="ts" setup>
import { useTokenStore } from 'stores/tokenStore'
import TokenTable from 'components/portal/TokenTable.vue'
import FleetCreateAction from 'components/fleet/actions/FleetCreateAction.vue'

useTokenStore()
</script>

<template>
  <q-card flat>
    <q-card-section>
      <FleetCreateAction v-if="useTokenStore().gameTokenAccountsSelected" />
    </q-card-section>
    <TokenTable
      v-if="useTokenStore().walletTokenAccounts"
      :rows="useTokenStore().gameTokenAccounts?.filter((acc) => acc.itemType == 'ship')!"
      item-type="ship"
      selection="multiple"
    />
  </q-card>
</template>
<style scoped></style>
