<script lang="ts" setup>
import { useProfileStore } from 'stores/profileStore'
import AccountExpansionItem from 'components/playerProfile/accounts/AccountExpansionItem.vue'
import { gePointsCategoryEnumString } from 'src/handler/PointsInterface'
</script>

<template>
  <q-card bordered flat>
    <q-card-section class="row items-center q-gutter-md">
      <q-icon name="visibility" size="md"></q-icon>
      <div class="text-h6">View Accounts</div>
    </q-card-section>
    <q-card-section class="row">
      <q-list bordered class="rounded-borders full-width" separator>
        <q-expansion-item
          :caption="useProfileStore().wallet?.toString() ?? 'none'"
          hide-expand-icon
          icon="perm_identity"
          label="Wallet"
        ></q-expansion-item>

        <AccountExpansionItem :account="useProfileStore().playerProfile" label="Player Profile" />

        <AccountExpansionItem :account="useProfileStore().nameProfile" label="Name Profile" />

        <AccountExpansionItem :account="useProfileStore().factionProfile" label="Faction Profile" />

        <AccountExpansionItem :account="useProfileStore().sageProfile" label="Faction Profile" />

        <AccountExpansionItem
          v-for="(point, idx) in useProfileStore().points"
          :key="idx"
          :account="point.points"
          :label="gePointsCategoryEnumString(point.category) + ' Points'"
        />
      </q-list>
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
