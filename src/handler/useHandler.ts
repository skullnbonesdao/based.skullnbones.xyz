import { computed, ComputedRef, Ref } from 'vue'
import { AnchorWallet, useAnchorWallet } from 'solana-wallets-vue'
import { Connection } from '@solana/web3.js'
import { useRPCStore } from 'stores/rpcStore'
import { ProfileHandler } from 'src/handler/ProfileHandler'
import { getSigner } from 'components/squads/SignerFinder'

interface Handler {
  wallet: Ref<AnchorWallet | undefined>
  connection: ComputedRef<Connection>
  profileHandler: ComputedRef<ProfileHandler>
}

let handler: Handler | undefined = undefined

export const useHandler = (): Handler | undefined => handler

export const initHandler = () => {
  const wallet = useAnchorWallet()
  const connection = computed(() => useRPCStore().connection as Connection)

  const profileHandler = computed(
    () => new ProfileHandler(useAnchorWallet().value!, useRPCStore().connection, getSigner()),
  )

  handler = {
    wallet,
    connection,
    profileHandler,
  } as Handler
}
