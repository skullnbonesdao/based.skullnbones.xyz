<script lang="ts" setup>
import { useRouter } from 'vue-router'

export interface NavigationLinkProps {
  title: string
  caption?: string
  to?: string
  icon?: string
}

withDefaults(defineProps<NavigationLinkProps>(), {
  caption: '',
  to: '#',
  icon: '',
})

const route = useRouter().currentRoute
</script>

<template>
  <q-item :active="route.path == to" :to="to" active-class="menu-link" clickable tag="a">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<style lang="sass" scoped>
.menu-link
  color: white
  background: $secondary
</style>
