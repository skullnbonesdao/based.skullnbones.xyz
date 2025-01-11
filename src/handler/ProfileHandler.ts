import { PLAYER_PROFILE_PROGRAM_ID, PROFILE_FACTION_PROGRAM_ID } from 'src/handler/constants'
import type { AnchorWallet } from 'solana-wallets-vue'
import { Connection, PublicKey } from '@solana/web3.js'
import { AnchorProvider, Program } from '@project-serum/anchor'
import {
  PLAYER_PROFILE_IDL,
  PlayerName,
  PlayerProfile,
  PlayerProfileIDL,
} from '@staratlas/player-profile'
import type { ProfileFactionIDL } from '@staratlas/profile-faction'
import { PROFILE_FACTION_IDL, ProfileFactionAccount } from '@staratlas/profile-faction'
import { publicKeyToAsyncSigner } from 'components/staratlas/helper'
import { AsyncSigner, readFromRPCOrError } from '@staratlas/data-source'
import { useRPCStore } from 'stores/rpcStore'
import { useWorkspaceAdapter } from 'components/staratlas/connector'

export class ProfileHandler {
  static readonly PLAYER_PROFILE_PROGRAM_ID = PLAYER_PROFILE_PROGRAM_ID
  static readonly PROFILE_FACTION_PROGRAM_ID = PROFILE_FACTION_PROGRAM_ID

  playerProfileProgram: Program<PlayerProfileIDL>
  factionProfileProgram: Program<ProfileFactionIDL>

  ready: Promise<boolean>
  signer: AsyncSigner
  playerProfileAddress: PublicKey | undefined
  private playerProfile: PlayerProfile | undefined
  private playerName: PlayerName | undefined
  private factionProfile: ProfileFactionAccount | undefined
  private connection: Connection
  private provider: AnchorProvider

  constructor(
    anchorWallet: AnchorWallet,
    connection: Connection,
    signer: PublicKey,
    wallet: PublicKey | undefined = undefined,
  ) {
    this.connection = connection
    this.provider = new AnchorProvider(connection, anchorWallet, AnchorProvider.defaultOptions())
    this.playerProfileProgram = new Program(
      PLAYER_PROFILE_IDL,
      ProfileHandler.PLAYER_PROFILE_PROGRAM_ID,
      this.provider,
    )
    this.factionProfileProgram = new Program(
      PROFILE_FACTION_IDL,
      ProfileHandler.PROFILE_FACTION_PROGRAM_ID,
      this.provider,
    )
    this.signer = publicKeyToAsyncSigner(signer)

    this.ready = Promise.all([this.loadPlayerProfileAddress(wallet ? wallet : signer)]).then(
      (result) => {
        this.playerProfileAddress = result[0]

        return Promise.resolve(true)
      },
    )
  }

  getProfileAddress(): PublicKey {
    if (this.playerProfileAddress) throw Error('profileAddress not defined')
    return this.playerProfileAddress as never as PublicKey
  }

  getProfileNameAddress() {
    return PlayerName.findAddress(this.playerProfileProgram, this.getProfileAddress())[0]
  }

  getFactionProfileAddress() {
    return ProfileFactionAccount.findAddress(
      this.factionProfileProgram,
      this.getProfileAddress(),
    )[0]
  }

  getPlayerProfile() {
    if (this.playerProfile) throw Error('playerProfile not defined')
    return this.playerProfile as never as PlayerProfile
  }

  private async loadPlayerProfileAddress(wallet: PublicKey) {
    const [accountInfo] = await this.connection.getProgramAccounts(
      ProfileHandler.PLAYER_PROFILE_PROGRAM_ID,
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

  private async loadPlayerProfile() {
    this.playerProfile = await readFromRPCOrError(
      useRPCStore().connection,
      useWorkspaceAdapter()!.playerProfileProgram.value,
      this.getProfileAddress(),
      PlayerProfile,
      'confirmed',
    )
  }

  private async loadPlayerName() {
    this.playerName = await readFromRPCOrError(
      useRPCStore().connection,
      useWorkspaceAdapter()!.playerProfileProgram.value,
      this.getProfileNameAddress(),
      PlayerName,
      'confirmed',
    )
  }

  private async loadProfileFaction() {
    this.factionProfile = await readFromRPCOrError(
      useRPCStore().connection,
      useWorkspaceAdapter()!.profileFactionProgram.value,
      this.getFactionProfileAddress(),
      ProfileFactionAccount,
    )
  }
}
