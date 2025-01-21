<script lang="ts" setup>
import { useTokenStore } from 'stores/tokenStore'
import TokenTable from 'components/portal/TokenTable.vue'
import FleetCreateButton from 'components/fleet/FleetCreateButton.vue'

useTokenStore()
</script>

<template>
  <q-card flat>
    <q-card-section>
      <FleetCreateButton v-if="useTokenStore().gameTokenAccountsSelected" />
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
