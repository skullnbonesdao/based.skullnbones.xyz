<template>
  <q-layout view="Hh Lpr lFf">
    <q-header class="bg-black">
      <q-toolbar>
        <q-btn aria-label="Menu" dense flat icon="menu" round @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-img class="q-my-sm" fit="scale-down" height="50px" src="icon_cut.png"></q-img>
        </q-toolbar-title>
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
            <SquadsButton />
          </div>
          <div class="col"></div>
        </q-card-section>
      </q-card>

      <q-scroll-area style="height: calc(100% - 300px); margin-top: 0px">
        <q-list>
          <NavigationLinks v-for="link in navigationLinks" :key="link.title" v-bind="link" />
        </q-list>
      </q-scroll-area>
      <div class="absolute-bottom q-ma-md">
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
import RPCSelect from 'components/rpc/RPCSelect.vue'
import SquadsButton from 'components/squads/SquadsButton.vue'

const navigationLinks: NavigationLinkProps[] = [
  {
    title: 'Home',
    icon: 'home',
    to: '/',
  },
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
