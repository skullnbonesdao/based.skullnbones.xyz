import { useSquadsStore } from './SquadsStore'
import { useWallet } from 'solana-wallets-vue'
import { PublicKey } from '@solana/web3.js'

export function getSigner() {
  return useSquadsStore().useSquads
    ? new PublicKey(useSquadsStore().vaultPDA)
    : (useWallet().publicKey.value ?? null)
}
