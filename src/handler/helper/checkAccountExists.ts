import { useRPCStore } from 'stores/rpcStore'
import type { PublicKey } from '@solana/web3.js'

export async function checkAccountExists(account: PublicKey): Promise<boolean> {
  try {
    const accountInfo = await useRPCStore().connection.getAccountInfo(account)

    return accountInfo !== null
  } catch {
    return false
  }
}
