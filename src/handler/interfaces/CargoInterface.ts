import { PublicKey } from '@solana/web3.js'
import { useWorkspaceAdapter } from 'src/handler/connector'
import { CargoType } from '@staratlas/cargo'
import { getCargoPodsByAuthority } from '@staratlas/sage'
import { useRPCStore } from 'stores/rpcStore'
import { findStarbasePlayerAddress } from 'src/handler/interfaces/GameInterface'
import { BN } from '@staratlas/anchor'

export function findCargoTypeAddress(cargoStatsDefinition: PublicKey, mint: PublicKey) {
  return CargoType.findAddress(
    useWorkspaceAdapter()!.cargoProgram.value!,
    cargoStatsDefinition,
    mint,
    0,
  )[0]
}

export async function findCargoPodAddress(index: number = 0) {
  const cargoPods = await getCargoPodsByAuthority(
    useRPCStore().connection,
    useWorkspaceAdapter()!.cargoProgram.value!,
    findStarbasePlayerAddress(),
  )

  const cargoPodAddress = cargoPods
    .filter((cargoPods) => cargoPods.type == 'ok')
    .find((cargoPod) => {
      const temp = new BN(cargoPod.data.stats.toString())
      return temp.gt(new BN(0))
    })?.key

  if (cargoPodAddress) return cargoPodAddress
  else throw Error('Unable to find cargo POD')
}
