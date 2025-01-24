<template>
  <q-layout view="Hh Lpr lFf">
    <q-header class="bg-black q-ma-none q-pa-none">
      <q-toolbar class="q-ma-none q-pa-none">
        <q-btn aria-label="Menu" dense flat icon="menu" round @click="toggleLeftDrawer" />

        <q-img fit="scale-down" src="icon_cut.png" style="max-width: 150px" />
        <div class="q-mx-xs q-mt-sm">v{{ display_version }}</div>

        <q-space />
        <RPCPriorityFee class="q-pa-sm" />
        <WalletMultiButton dark />
      </q-toolbar>
      <q-separator />
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered show-if-above>
      <q-card class="q-mb-md" flat>
        <q-card-section>
          <q-img fit="scale-down" height="50px" src="icon.png"></q-img>
        </q-card-section>

        <q-card-section class="row">
          <div class="col"></div>
          <div>
            <WalletMultiButton dark />
            <SquadsButton v-if="useSquadsStore().storeSelected?.label" />
          </div>
          <div class="col"></div>
        </q-card-section>
      </q-card>

      <q-scroll-area style="height: calc(100% - 300px); margin-top: 0px">
        <q-list>
          <NavigationLinks v-for="link in navigationLinksBase" :key="link.title" v-bind="link" />
        </q-list>
      </q-scroll-area>
      <div class="absolute-bottom">
        <NavigationLinks v-for="link in navigationLinksSquads" :key="link.title" v-bind="link" />
        <RPCSelect />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { WalletMultiButton } from 'solana-wallets-vue'
import type { NavigationLinkProps } from 'components/NavigationLinks.vue'
import NavigationLinks from 'components/NavigationLinks.vue'
import SquadsButton from 'components/squads/SquadsButton.vue'
import { useSquadsStore } from 'components/squads/SquadsStore'
import RPCSelect from 'components/rpc/RPCSelect.vue'
import { version } from 'src/../package.json'
import RPCPriorityFee from 'components/rpc/RPCPriorityFee.vue'

const display_version = ref(version)

const navigationLinksBase: NavigationLinkProps[] = [
  {
    title: 'Home',
    icon: 'home',
    to: '/',
  },
  {
    title: 'Profile',
    caption: 'View and Manage',
    icon: 'person',
    to: '/playerProfile',
  },
  {
    title: 'Portal',
    caption: 'Deposit and Withdraw',
    icon: 'door_front',
    to: '/portal',
  },
  {
    title: 'Feet',
    caption: 'Fleet builder',
    icon: 'precision_manufacturing',
    to: '/fleet',
  },
]

const navigationLinksSquads: NavigationLinkProps[] = [
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
