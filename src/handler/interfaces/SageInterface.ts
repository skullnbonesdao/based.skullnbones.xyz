import type { PublicKey } from '@solana/web3.js'
import { SagePlayerProfile } from '@staratlas/sage/src'
import { useWorkspaceAdapter } from 'src/handler/connector'
import { readAllFromRPC, readFromRPCOrError } from '@staratlas/data-source'
import { useRPCStore } from 'stores/rpcStore'
import { Game, Starbase, StarbasePlayer } from '@staratlas/sage'
import { useGameStore } from 'stores/gameStore'
import { useProfileStore } from 'stores/profileStore'

export function findSageProfileAddress(profileAddress: PublicKey, gameID: PublicKey) {
  return SagePlayerProfile.findAddress(
    useWorkspaceAdapter()!.sageProgram.value,
    profileAddress,
    gameID,
  )[0]
}

export function findStarbasePlayerAddress() {
  return StarbasePlayer.findAddress(
    useWorkspaceAdapter()!.sageProgram.value,
    useGameStore().starbase!.key,
    useProfileStore().playerProfileAddress!,
    useGameStore().starbase!.data.seqId,
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

export async function loadStarbases() {
  const data = await readAllFromRPC(
    useRPCStore().connection,
    useWorkspaceAdapter()!.sageProgram.value!,
    Starbase,
    'confirmed',
  )

  const starbases: Starbase[] = []

  data.map((d) => {
    if (d.type == 'ok') {
      starbases.push(new Starbase(d.data.data, d.data.key, d.data.upgradeIngredientAmounts))
    }
  })

  return starbases
}

export async function loadStarbasePlayer() {
  return await readFromRPCOrError(
    useRPCStore().connection,
    useWorkspaceAdapter()!.sageProgram.value!,
    findStarbasePlayerAddress(),
    StarbasePlayer,
    'confirmed',
  )
}
