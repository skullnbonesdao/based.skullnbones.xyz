// piniaLocalStoragePlugin.ts
import type { PiniaPluginContext } from 'pinia'

export function localStoragePlugin({ store }: PiniaPluginContext) {
  // Only apply to the "gameStore", or check store.$id as needed
  if (store.$id !== 'gameStore') return

  // Load existing starbase from localStorage if available
  const savedStarbase = localStorage.getItem('gameStore_starbase')
  if (savedStarbase) {
    try {
      // Merge or overwrite the store's starbase
      //store.$patch({ starbase: JSON.parse(savedStarbase) as Starbase })
    } catch (err) {
      console.error(`Failed to parse stored starbase: ${err}`)
    }
  }

  // Whenever store changes, save `starbase` to localStorage
  store.$subscribe((_mutation, state) => {
    localStorage.setItem('gameStore_starbase', JSON.stringify(state.starbase))
  })
}
