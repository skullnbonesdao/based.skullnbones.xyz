import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('globalStore', {
  state: () => ({
    is_loading: false,
  }),
  getters: {
    loading(state) {
      return state.is_loading
    },
  },
  actions: {
    loading_on() {
      this.is_loading = true
    },
    loading_off() {
      this.is_loading = false
    },
  },
})
