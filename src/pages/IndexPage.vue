<template>
  <q-page class="row q-pa-md justify-evenly">
    <div>
      <q-card flat>
        <q-separator />
        <q-card-section class="items-center q-gutter-md">
          <q-img src="icon.png" width="400px"></q-img>
        </q-card-section>
      </q-card>
      <q-card flat>
        <q-separator />
        <q-card-section class="items-center q-gutter-md">
          <div class="text-h5 text-center text-uppercase">manage your StarAtlas</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { Meta, Todo } from 'components/models'

const todos = ref<Todo[]>([
  {
    id: 1,
    content: 'Create Player Profile',
  },
  {
    id: 2,
    content: 'ct2',
  },
  {
    id: 3,
    content: 'ct3',
  },
  {
    id: 4,
    content: 'ct4',
  },
  {
    id: 5,
    content: 'ct5',
  },
])

const meta = ref<Meta>({
  totalCount: 1200,
})
</script>
