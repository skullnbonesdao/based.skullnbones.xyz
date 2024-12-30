<template>
  <q-layout view="Hh Lpr lFf">
    <q-header class="bg-black">
      <q-toolbar>
        <q-btn aria-label="Menu" dense flat icon="menu" round @click="toggleLeftDrawer" />

        <q-toolbar-title>Sage Manager</q-toolbar-title>

        <div>
          <WalletMultiButton dark />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered show-if-above>
      <q-list>
        <q-item-label header>General</q-item-label>

        <NavigationLinks v-for="link in navigationLinks" :key="link.title" v-bind="link" />

        <RPCSelect />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { WalletMultiButton } from 'solana-wallets-vue'
import NavigationLinks, { NavigationLinkProps } from 'components/NavigationLinks.vue'
import RPCSelect from 'components/rpc/RPCSelect.vue'

const navigationLinks: NavigationLinkProps[] = [
  {
    title: 'PlayerProfile',
    caption: 'Manage and view',
    icon: 'person',
    to: '/playerProfile',
  },
  {
    title: 'Squads',
    caption: 'use squads multisig',
    icon: 'groups',
    to: '/squads',
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
