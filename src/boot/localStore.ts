// You can either import the default styles or create your own.
import 'src/css/wallet_connect.css'
import { boot } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import { localStoragePlugin } from 'stores/localStoragePlugin'

export default boot(({ app }) => {
  const pinia = createPinia()
  // Use our localStorage plugin
  pinia.use(localStoragePlugin)

  app.use(pinia)

  console.log('[added] Plugin: localStore')
})
