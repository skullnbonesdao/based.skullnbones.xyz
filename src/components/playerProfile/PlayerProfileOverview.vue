<script lang="ts" setup>
import { useProfileStore } from 'stores/profileStore'
import AccountExpansionItem from 'components/playerProfile/accounts/AccountExpansionItem.vue'
import { getPointsCategoryEnumString } from 'src/handler/convert/EnumToString'
import { useGlobalStore } from 'stores/globalStore'
</script>

<template>
  <q-card bordered flat>
    <q-inner-loading
      :showing="useGlobalStore().is_loading"
      label="Please wait..."
      label-style="font-size: 1.2em"
    />

    <q-card-section class="row items-center q-gutter-md">
      <q-icon name="visibility" size="md"></q-icon>
      <div class="text-h6">View Accounts</div>
    </q-card-section>

    <div class="row">
      <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <q-list bordered class="rounded-borders full-width" separator>
          <q-expansion-item
            :caption="useProfileStore().wallet?.toString() ?? 'none'"
            hide-expand-icon
            icon="perm_identity"
            label="Wallet"
          ></q-expansion-item>

          <AccountExpansionItem
            :account="useProfileStore().playerProfile"
            hide-expand-icon
            label="Player Profile"
          />

          <AccountExpansionItem
            :account="useProfileStore().nameProfile"
            hide-expand-icon
            label="Name Profile"
          />

          <AccountExpansionItem
            :account="useProfileStore().factionProfile"
            hide-expand-icon
            label="Faction Profile"
          />

          <AccountExpansionItem
            :account="useProfileStore().sageProfile"
            hide-expand-icon
            label="Sage Profile"
          />

          <AccountExpansionItem
            v-for="(point, idx) in useProfileStore().points"
            :key="idx"
            :account="point.points"
            :label="getPointsCategoryEnumString(point.category) + ' Points'"
            hide-expand-icon
          />
        </q-list>
      </transition>
    </div>
  </q-card>
</template>

<style scoped></style>
