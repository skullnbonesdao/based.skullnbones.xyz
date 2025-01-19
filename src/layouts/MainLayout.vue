<template>
  <q-layout view="Hh Lpr lFf">
    <q-header class="bg-black">
      <q-toolbar>
        <q-btn aria-label="Menu" dense flat icon="menu" round @click="toggleLeftDrawer" />

        <q-img fit="scale-down" src="icon_cut.png" style="max-width: 100px" />
        <q-space />
        <WalletMultiButton dark />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered class="bg-primary" show-if-above>
      <q-card class="q-mb-md bg-primary" flat>
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
import NavigationLinks, { NavigationLinkProps } from 'components/NavigationLinks.vue'
import SquadsButton from 'components/squads/SquadsButton.vue'
import { useSquadsStore } from 'components/squads/SquadsStore'
import RPCSelect from 'components/rpc/RPCSelect.vue'

const navigationLinksBase: NavigationLinkProps[] = [
  {
    title: 'Home',
    icon: 'home',
    to: '/',
  },
  {
    title: 'PlayerProfile',
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
