import { PublicKey } from '@solana/web3.js'
import type { AnyTransaction, AsyncSigner } from '@staratlas/data-source'
import type { WalletStore } from 'solana-wallets-vue/dist/types'
import { useSquadsStore } from 'components/squads/SquadsStore'
import { getSigner } from 'components/squads/SignerFinder'
import { useWallet } from 'solana-wallets-vue'

export function publicKeyToAsyncSigner(publicKey: PublicKey): AsyncSigner<WalletStore> {
  return {
    publicKey: () => publicKey,
    requiresAsync(): boolean {
      return true
    },
  } as never
}

export function walletStoreToAsyncSigner(wallet: WalletStore): AsyncSigner<WalletStore> {
  return {
    inner(): WalletStore {
      return wallet
    },
    publicKey(): PublicKey {
      return wallet.publicKey.value!
    },
    requiresAsync(): boolean {
      return true
    },
    sign<TT extends AnyTransaction>(tx: TT): Promise<TT> {
      return wallet.signTransaction.value!(tx)
    },
    signAll<TT extends AnyTransaction>(txs: TT[]): Promise<TT[]> {
      return wallet.signAllTransactions.value!(txs)
    },
  }
}

export function getAsyncSigner() {
  return useSquadsStore().useSquads
    ? publicKeyToAsyncSigner(getSigner())
    : walletStoreToAsyncSigner(useWallet())
}
