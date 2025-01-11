import type { PublicKey } from '@solana/web3.js'
import { SagePlayerProfile } from '@staratlas/sage/src'
import { useWorkspaceAdapter } from 'components/staratlas/connector'
import { readFromRPCOrError } from '@staratlas/data-source'
import { useRPCStore } from 'stores/rpcStore'
import { Game } from '@staratlas/sage'

export function findSageProfileAddress(profileAddress: PublicKey, gameID: PublicKey) {
  return SagePlayerProfile.findAddress(
    useWorkspaceAdapter()!.sageProgram.value,
    profileAddress,
    gameID,
  )[0]
}

export async function loadSageProfile(sageProfileAddress: PublicKey) {
  return await readFromRPCOrError(
    useRPCStore().connection,
    useWorkspaceAdapter()!.sageProgram.value,
    sageProfileAddress,
    SagePlayerProfile,
  )
}

export async function loadGame(gameID: PublicKey) {
  return await readFromRPCOrError(
    useRPCStore().connection,
    useWorkspaceAdapter()!.sageProgram.value,
    gameID,
    Game,
    'confirmed',
  )
}
