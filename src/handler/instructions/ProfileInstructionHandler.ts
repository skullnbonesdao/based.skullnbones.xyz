import { PlayerProfile, ProfilePermissions } from '@staratlas/player-profile'
import { useWorkspaceAdapter } from 'src/handler/connector'
import type { PublicKey } from '@solana/web3.js'
import type { Faction } from '@staratlas/profile-faction'
import { ProfileFactionAccount } from '@staratlas/profile-faction'
import { SagePermissions, SagePlayerProfile } from '@staratlas/sage'
import { useProfileStore } from 'stores/profileStore'
import type { AsyncSigner } from '@staratlas/data-source'

import { PointsPermissions, UserPoints } from '@staratlas/points'
import { useGameStore } from 'stores/gameStore'
import type { BN } from '@staratlas/anchor'
import {
  PLAYER_PROFILE_PROGRAM_ID,
  POINTS_PROGRAM_ID,
  POINTS_STORE_PROGRAM_ID,
  PROFILE_VAULT_PROGRAM_ID,
  SAGE_PROGRAM_ID,
} from 'src/handler/constants'
import { PointsStorePermissions } from '@staratlas/points-store'
import { FeePayerPermissions } from '@staratlas/atlas-prime'

export const permissionOptions = [
  {
    label: 'PlayerProfile',
    address: PLAYER_PROFILE_PROGRAM_ID.toString(),
  },
  {
    label: 'SagePermission',
    address: SAGE_PROGRAM_ID.toString(),
  },
  {
    label: 'PointsPermission',
    address: POINTS_PROGRAM_ID.toString(),
  },
  {
    label: 'PointsStorePermission',
    address: POINTS_STORE_PROGRAM_ID.toString(),
  },
  {
    label: 'FeePayerPermission',
    address: PROFILE_VAULT_PROGRAM_ID.toString(),
  },
]

export class ProfileInstructionHandler {
  signer: AsyncSigner

  constructor(signer: AsyncSigner) {
    this.signer = signer
  }

  createPlayerProfileIx(key: PublicKey, profile: AsyncSigner) {
    return PlayerProfile.createProfile(
      useWorkspaceAdapter()!.playerProfileProgram.value,
      profile,
      [
        {
          key: key,
          expireTime: null,
          scope: PLAYER_PROFILE_PROGRAM_ID,
          permissions: ProfilePermissions.all(),
        },
      ],
      1,
    )
  }

  createPlayerProfileNameIx(name: string) {
    const { instructions } = PlayerProfile.setName(
      useWorkspaceAdapter()!.playerProfileProgram.value,
      {
        profile: useProfileStore().playerProfile as PlayerProfile,
        key: this.signer,
        playerProfileProgram: useWorkspaceAdapter()!.playerProfileProgram.value,
      },
      // walletSigner,
      name,
    )
    return instructions
  }

  createChooseFactionIx(faction: Faction.MUD | Faction.ONI | Faction.Ustur) {
    const { instructions } = ProfileFactionAccount.chooseFaction(
      useWorkspaceAdapter()!.profileFactionProgram.value,
      {
        profile: useProfileStore().playerProfile as PlayerProfile,
        key: this.signer,
        playerProfileProgram: useWorkspaceAdapter()!.playerProfileProgram.value,
      },
      faction,
    )
    return instructions
  }

  createSagePlayerProfileIx() {
    return SagePlayerProfile.registerSagePlayerProfile(
      useWorkspaceAdapter()!.sageProgram.value,
      useProfileStore().playerProfileAddress!,
      useGameStore().game!.key,
      useGameStore().game!.data.gameState,
    )
  }

  createPointsIx(pointsCategoryKey: PublicKey) {
    const { instructions } = UserPoints.createUserPointAccount(
      useWorkspaceAdapter()!.pointsProgram.value,
      useProfileStore()!.playerProfile!.key,
      pointsCategoryKey,
    )
    return instructions
  }

  addSageKeyPermissionToProfileIx(
    key: PublicKey,
    permissions: SagePermissions,
    expireTime: BN | null = null,
  ) {
    return PlayerProfile.addKeys(
      useWorkspaceAdapter()!.playerProfileProgram.value,
      this.signer,
      useProfileStore()!.playerProfile as PlayerProfile,
      SagePermissions,
      SAGE_PROGRAM_ID,
      [
        {
          key: key,
          permissions: permissions,
          expireTime: expireTime,
        },
      ],
    )
  }

  addPointsKeyPermissionToProfileIx(
    key: PublicKey,
    permissions: PointsPermissions,
    expireTime: BN | null = null,
  ) {
    return PlayerProfile.addKeys(
      useWorkspaceAdapter()!.playerProfileProgram.value,
      this.signer,
      useProfileStore()!.playerProfile as PlayerProfile,
      PointsPermissions,
      POINTS_PROGRAM_ID,
      [
        {
          key: key,
          permissions: permissions,
          expireTime: expireTime,
        },
      ],
    )
  }

  addPointsStoreKeyPermissionToProfileIx(
    key: PublicKey,
    permissions: PointsStorePermissions,
    expireTime: BN | null = null,
  ) {
    return PlayerProfile.addKeys(
      useWorkspaceAdapter()!.playerProfileProgram.value,
      this.signer,
      useProfileStore()!.playerProfile as PlayerProfile,
      PointsStorePermissions,
      POINTS_STORE_PROGRAM_ID,
      [
        {
          key: key,
          permissions: permissions,
          expireTime: expireTime,
        },
      ],
    )
  }

  addFeePayerPermissionToProfileIx(
    key: PublicKey,
    permissions: FeePayerPermissions,
    expireTime: BN | null = null,
  ) {
    return PlayerProfile.addKeys(
      useWorkspaceAdapter()!.playerProfileProgram.value,
      this.signer,
      useProfileStore()!.playerProfile as PlayerProfile,
      FeePayerPermissions,
      PROFILE_VAULT_PROGRAM_ID,
      [
        {
          key: key,
          permissions: permissions,
          expireTime: expireTime,
        },
      ],
    )
  }

  removeKeyFromProfileIx(range: [number, number]) {
    return PlayerProfile.removeKeys(
      useWorkspaceAdapter()!.playerProfileProgram.value,
      {
        profileKey: useProfileStore().playerProfile?.key as PublicKey,
        key: this.signer,
        keyIndex: 0,
        playerProfileProgram: useWorkspaceAdapter()!.playerProfileProgram.value,
      },
      this.signer.publicKey(),
      range,
    )
  }
}
