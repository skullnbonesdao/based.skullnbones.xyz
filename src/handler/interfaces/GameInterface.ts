import { PublicKey } from '@solana/web3.js'
import { SagePlayerProfile } from '@staratlas/sage/src'
import { useWorkspaceAdapter } from 'src/handler/connector'
import { readAllFromRPC, readFromRPCOrError } from '@staratlas/data-source'
import { useRPCStore } from 'stores/rpcStore'
import {
  Fleet,
  Game,
  Planet,
  Resource,
  Sector,
  Ship,
  Starbase,
  StarbasePlayer,
} from '@staratlas/sage'
import { useGameStore } from 'stores/gameStore'
import { useProfileStore } from 'stores/profileStore'
import { MineItem } from '@staratlas/sage/dist/src/mineItem'
import { usePlayerStore } from 'stores/playerStore'

export function findSageProfileAddress(profileAddress: PublicKey, gameID: PublicKey) {
  return SagePlayerProfile.findAddress(
    useWorkspaceAdapter()!.sageProgram.value,
    profileAddress,
    gameID,
  )[0]
}

export function findStarbasePlayerAddress() {
  if (!usePlayerStore().currentStarbase) throw Error('starbase is not set')
  return StarbasePlayer.findAddress(
    useWorkspaceAdapter()!.sageProgram.value,
    usePlayerStore().currentStarbase!.key,
    findSageProfileAddress(useProfileStore().playerProfileAddress!, useGameStore().gameID),
    usePlayerStore().currentStarbase!.data.seqId,
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

export async function loadSectors() {
  const data = await readAllFromRPC(
    useRPCStore().connection,
    useWorkspaceAdapter()!.sageProgram.value!,
    Sector,
    'confirmed',
  )

  const sectors: Sector[] = []

  data.map((d) => {
    if (d.type == 'ok') {
      sectors.push(
        new Sector(d.data.data, d.data.key, JSON.parse(JSON.stringify(d.data.connections))),
      )
    }
  })

  return sectors
}

export async function loadMineItem() {
  const data = await readAllFromRPC(
    useRPCStore().connection,
    useWorkspaceAdapter()!.sageProgram.value!,
    MineItem,
    'confirmed',
  )

  const mineItems: MineItem[] = []

  data.map((d) => {
    if (d.type == 'ok') {
      mineItems.push(new MineItem(d.data.data, d.data.key))
    }
  })

  return mineItems
}

export async function loadPlanets() {
  const data = await readAllFromRPC(
    useRPCStore().connection,
    useWorkspaceAdapter()!.sageProgram.value!,
    Planet,
    'confirmed',
  )

  const planets: Planet[] = []

  data.map((d) => {
    if (d.type == 'ok') {
      planets.push(new Planet(d.data.data, d.data.key))
    }
  })

  return planets
}

export async function loadResources() {
  const data = await readAllFromRPC(
    useRPCStore().connection,
    useWorkspaceAdapter()!.sageProgram.value!,
    Resource,
    'confirmed',
  )

  const resources: Resource[] = []

  data.map((d) => {
    if (d.type == 'ok') {
      resources.push(new Resource(d.data.data, d.data.key))
    }
  })

  return resources
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
      commitment: 'processed',
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
