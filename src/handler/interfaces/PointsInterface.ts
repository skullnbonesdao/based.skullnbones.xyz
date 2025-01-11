import { PublicKey } from '@solana/web3.js'
import { useWorkspaceAdapter } from 'src/handler/connector'
import { UserPoints } from '@staratlas/points'
import { readFromRPCOrError } from '@staratlas/data-source'
import { useRPCStore } from 'stores/rpcStore'

export enum PointsCategoryEnum {
  NONE,
  LP,
  PILOT,
  DATA,
  MINE,
  CRAFT,
}

export const PointsCategories = [
  {
    kind: PointsCategoryEnum.LP,
    key: new PublicKey('LPkmmDQG8iBDAfKkWN6QadeoiLSvD1p3fGgq8m8QdMu'),
  },
  {
    kind: PointsCategoryEnum.PILOT,
    key: new PublicKey('PiLotBQoUBUvKxMrrQbuR3qDhqgwLJctWsXj3uR7fGs'),
  },
  {
    kind: PointsCategoryEnum.DATA,
    key: new PublicKey('DataJpxFgHhzwu4zYJeHCnAv21YqWtanEBphNxXBHdEY'),
  },
  {
    kind: PointsCategoryEnum.MINE,
    key: new PublicKey('MineMBxARiRdMh7s1wdStSK4Ns3YfnLjBfvF5ZCnzuw'),
  },
  {
    kind: PointsCategoryEnum.CRAFT,
    key: new PublicKey('CraftndAV62acibnaW7TiwEYwu8MmJZBdyrfyN54nre7'),
  },
]

export function findPointsAddress(playerProfileAddress: PublicKey, category: PointsCategoryEnum) {
  return UserPoints.findAddress(
    useWorkspaceAdapter()!.pointsProgram.value!,
    PointsCategories.find((c) => c.kind == category)!.key,
    playerProfileAddress,
  )[0]
}

export async function loadPoints(pointsAddress: PublicKey) {
  return await readFromRPCOrError(
    useRPCStore().connection,
    useWorkspaceAdapter()!.pointsProgram.value,
    pointsAddress,
    UserPoints,
  )
}
