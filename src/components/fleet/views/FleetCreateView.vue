<script lang="ts" setup>
import { useTokenStore } from 'stores/tokenStore'
import TokenTable from 'components/portal/TokenTable.vue'
import FleetCreateAction from 'components/fleet/actions/FleetCreateAction.vue'
import { usePlayerStore } from 'stores/playerStore'

const tokenStore = useTokenStore()
const playerStore = usePlayerStore()
</script>

<template>
  <q-card flat>
    <q-card-section>
      <FleetCreateAction v-if="playerStore.starbaseTokenAccountsSelected" />
    </q-card-section>
    <TokenTable
      v-if="tokenStore.walletTokenAccounts"
      :rows="playerStore.starbaseTokenAccounts?.filter((account) => account.itemType === 'ship')!"
      item-type="ship"
      selection="single"
    />
  </q-card>
</template>
<style scoped></style>
