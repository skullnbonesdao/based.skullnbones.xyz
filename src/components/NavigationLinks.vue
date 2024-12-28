<script lang="ts" setup>
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
</script>

<template>
  <q-item :to="to" clickable tag="a">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<style scoped></style>
