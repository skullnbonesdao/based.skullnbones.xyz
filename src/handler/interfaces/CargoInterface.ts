import { PublicKey } from '@solana/web3.js'
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

export async function findCargoPodAddress(index: number = 0) {
  /*
    const cargoPods = await getCargoPodsByAuthority(
      useRPCStore().connection,
      useWorkspaceAdapter()!.cargoProgram.value!,
      findStarbasePlayerAddress(),
    )
  */

  /*
    cargoPods.forEach((cargoPod) => {
      console.log(cargoPod.key.toString())
    })
  */

  return new PublicKey('EatffFvG5sKh6qzoyZKtJ9JGCRpYbwWQpfQGta6c9cRG') //
  //return new PublicKey('3GJB59zhLisRVKe8gLYDSWSU8otuZWZrw8NGLhWuYKAm') //
  //return new PublicKey('6uJuzcGKXiFfCXPkrAx9xzgfUAn8LoAD9ieTs43Um3H9') //
  //return new PublicKey('8YPDojQ5dVz6QnpDHQXYUquYa5qcjhPG6nVAG8bqUDek') //

  //else throw Error('Unable to find cargo POD')
}
