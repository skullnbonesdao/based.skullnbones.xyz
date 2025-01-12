import type { PublicKey } from '@solana/web3.js'
import { useWorkspaceAdapter } from 'src/handler/connector'
import { CargoType } from '@staratlas/cargo'

export function findCargoTypeAddress(cargoStatsDefinition: PublicKey, mint: PublicKey) {
  return CargoType.findAddress(
    useWorkspaceAdapter()!.cargoProgram.value!,
    cargoStatsDefinition,
    mint,
    0,
  )[0]
}
