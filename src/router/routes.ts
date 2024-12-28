import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  {
    path: '/playerProfile',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/PlayerProfile.vue') }],
  },

  {
    path: '/squads',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('components/squads/SquadsPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
