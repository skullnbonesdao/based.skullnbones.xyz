import { PLAYER_PROFILE_PROGRAM_ID } from 'src/handler/constants'
import { PublicKey } from '@solana/web3.js'
import { useRPCStore } from 'stores/rpcStore'
import { PlayerName, PlayerProfile } from '@staratlas/player-profile'
import { useWorkspaceAdapter } from 'src/handler/connector'
import { ProfileFactionAccount } from '@staratlas/profile-faction'
import { readFromRPCOrError } from '@staratlas/data-source'

export async function loadPlayerProfileAddress(wallet: PublicKey) {
  const [accountInfo] = await useRPCStore().connection.getProgramAccounts(
    PLAYER_PROFILE_PROGRAM_ID,
    {
      filters: [
        {
          memcmp: {
            offset: 30,
            bytes: wallet.toBase58(),
          },
        },
      ],
    },
  )
  return accountInfo?.pubkey
}

export function findProfileNameAddress(profileAddress: PublicKey) {
  return PlayerName.findAddress(
    useWorkspaceAdapter()!.playerProfileProgram.value,
    profileAddress,
  )[0]
}

export function findFactionProfileAddress(profileAddress: PublicKey) {
  return ProfileFactionAccount.findAddress(
    useWorkspaceAdapter()!.profileFactionProgram.value,
    profileAddress,
  )[0]
}

export async function loadPlayerProfile(playerProfileAddress: PublicKey) {
  return await readFromRPCOrError(
    useRPCStore().connection,
    useWorkspaceAdapter()!.playerProfileProgram.value,
    playerProfileAddress,
    PlayerProfile,
    'confirmed',
  )
}

export async function loadPlayerName(nameProfileAddress: PublicKey) {
  return await readFromRPCOrError(
    useRPCStore().connection,
    useWorkspaceAdapter()!.playerProfileProgram.value,
    nameProfileAddress,
    PlayerName,
    'confirmed',
  )
}

export async function loadFactionProfile(factionProfileAddress: PublicKey) {
  return await readFromRPCOrError(
    useRPCStore().connection,
    useWorkspaceAdapter()!.profileFactionProgram.value,
    factionProfileAddress,
    ProfileFactionAccount,
    'confirmed',
  )
}
