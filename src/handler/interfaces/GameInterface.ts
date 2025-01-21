import { PublicKey } from '@solana/web3.js'
import { SagePlayerProfile } from '@staratlas/sage/src'
import { useWorkspaceAdapter } from 'src/handler/connector'
import { readAllFromRPC, readFromRPCOrError } from '@staratlas/data-source'
import { useRPCStore } from 'stores/rpcStore'
import { Fleet, Game, Ship, Starbase, StarbasePlayer } from '@staratlas/sage'
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
  if (!useGameStore().starbase) throw Error('starbase is not set')
  return StarbasePlayer.findAddress(
    useWorkspaceAdapter()!.sageProgram.value,
    useGameStore().starbase!.key,
    findSageProfileAddress(useProfileStore().playerProfileAddress!, useGameStore().gameID),
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

export async function loadShips() {
  const data = await readAllFromRPC(
    useRPCStore().connection,
    useWorkspaceAdapter()!.sageProgram.value!,
    Ship,
  )

  const ships: Ship[] = []
  data.map((d) => {
    if (d.type == 'ok') {
      ships.push(new Ship(d.data.data, d.data.key))
    }
  })
  return ships
}

export async function loadFleets() {
  const fleets: Fleet[] = []
  const temp = await useRPCStore().connection.getProgramAccounts(
    useWorkspaceAdapter()!.sageProgram.value!.programId,
    {
      filters: [
        {
          memcmp: {
            offset: 8 + 1 + 32, // number of bytes
            bytes: useProfileStore().playerProfileAddress!.toBase58(),
          },
        },
      ],
    },
  )

  for (const fleet of temp) {
    fleets.push(
      await readFromRPCOrError(
        useRPCStore().connection,
        useWorkspaceAdapter()!.sageProgram.value!,
        fleet.pubkey,
        Fleet,
      ),
    )
  }
  return fleets
}

export function findShipByMint(mint: PublicKey) {
  if (!useGameStore().ships) throw Error(`ships not set`)

  return useGameStore().ships?.find(
    (ship) =>
      ship.data.mint.toString() == mint.toString() &&
      ship.data.next.key.toString() == PublicKey.default.toString(),
  )!.key
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
