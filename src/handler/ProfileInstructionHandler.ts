import { PlayerProfile, ProfilePermissions } from '@staratlas/player-profile'
import {
  PLAYER_PROFILE_PROGRAM_ID,
  SAGE_PROGRAM_ID,
  useWorkspaceAdapter,
} from 'components/staratlas/connector'
import type { PublicKey } from '@solana/web3.js'
import type { Faction } from '@staratlas/profile-faction'
import { ProfileFactionAccount } from '@staratlas/profile-faction'
import { SagePermissions, SagePlayerProfile } from '@staratlas/sage'
import { useProfileStore } from 'stores/profileStore'
import type { AsyncSigner } from '@staratlas/data-source'

import { UserPoints } from '@staratlas/points'
import { useSageStore } from 'stores/sageStore'

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
      useSageStore().game!.key,
      useSageStore().game!.data.gameState,
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

  addSageKeyToProfileIx(key: PublicKey, permissions: never, expireTime: number | null = null) {
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
