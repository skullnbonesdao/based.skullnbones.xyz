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
    children: [{ path: '', component: () => import('pages/PlayerProfilePage.vue') }],
  },

  {
    path: '/squads',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SquadsPage.vue') }],
  },

  {
    path: '/portal',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/PortalPage.vue') }],
  },

  {
    path: '/fleet',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/FleetPage.vue') }],
  },

  {
    path: '/test',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/TestPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
