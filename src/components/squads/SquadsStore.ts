import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import * as multisig from '@sqds/multisig'
import type { Connection } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'
import { useRPCStore } from 'stores/rpcStore'
import type { Multisig } from '@sqds/multisig/lib/generated'

export type SquadsStore = {
  label: string
  value: string
}

export const useSquadsStore = defineStore('squadsStore', {
  state: () => ({
    useSquads: useLocalStorage('useSquads', false),

    store: useLocalStorage('store', [] as SquadsStore[]),
    storeSelected: useLocalStorage('storeSelected', {} as SquadsStore),

    multisigPDA: useLocalStorage('multisigPDA', ''),
    vaultPDA: useLocalStorage('vaultPDA', ''),
    multisigInfo: {} as Multisig,
  }),

  getters: {
    getLink(state) {
      if (state.multisigPDA.length == 0) return 'https://app.squads.so'
      else return `https://app.squads.so/squads/${state.vaultPDA}/`
    },
    getVaultPDA(state) {
      if (!state.multisigPDA) return ''

      try {
        const [vaultPda, _bump] = multisig.getVaultPda({
          multisigPda: new PublicKey(state.multisigPDA),
          index: 0,
        })
        state.vaultPDA = vaultPda.toString()
        return vaultPda
      } catch (err) {
        console.error(err)
      }
    },
    getNewTransactionIndex(state) {
      return BigInt(state.multisigInfo.transactionIndex + 1)
    },
  },
  actions: {
    addToStore(label: string, address: string) {
      try {
        if (this.store.find((m: any) => m.value.includes(address))) return
        else {
          if (address) this.store.push({ label: label, value: address } as never)
          return
        }
      } catch (error) {
        this.store = []
        this.store.push({ label: label, value: address } as never)
      }
    },

    removeFromStore() {
      try {
        this.store = this.store.filter(
          (s) => !(s.label == this.storeSelected?.label && s.value == this.storeSelected?.value),
        )
      } catch (error) {}
    },
    async update() {
      this.multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
        useRPCStore().connection as Connection,
        new PublicKey(this.multisigPDA),
      )
      console.log('[Updated] Squads store')
    },
  },
})
