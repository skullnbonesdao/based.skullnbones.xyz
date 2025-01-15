import type { ComputedRef, Ref } from 'vue'
import { computed } from 'vue'
import type { AnchorWallet } from 'solana-wallets-vue'
import { useAnchorWallet } from 'solana-wallets-vue'
import type { Connection } from '@solana/web3.js'
import { AnchorProvider, Program } from '@staratlas/anchor'
import { useRPCStore } from 'stores/rpcStore'
import type { PlayerProfileIDLProgram } from '@staratlas/player-profile'
import { PLAYER_PROFILE_IDL } from '@staratlas/player-profile'
import type { ProfileFactionIDLProgram } from '@staratlas/profile-faction'
import { PROFILE_FACTION_IDL } from '@staratlas/profile-faction'
import { SAGE_IDL, SageIDLProgram } from '@staratlas/sage'
import { POINTS_IDL, PointsIDLProgram } from '@staratlas/points'
import { CARGO_IDL, CargoIDLProgram } from '@staratlas/cargo'
import {
  CARGO_PROGRAM_ID,
  PLAYER_PROFILE_PROGRAM_ID,
  POINTS_PROGRAM_ID,
  PROFILE_FACTION_PROGRAM_ID,
  SAGE_PROGRAM_ID,
} from 'src/handler/constants'

const preflightCommitment = 'processed'
const commitment = 'confirmed'

interface Workspace {
  wallet: Ref<AnchorWallet | undefined>
  connection: ComputedRef<Connection>
  provider: ComputedRef<AnchorProvider>

  playerProfileProgram: ComputedRef<PlayerProfileIDLProgram>
  profileFactionProgram: ComputedRef<ProfileFactionIDLProgram>
  sageProgram: ComputedRef<SageIDLProgram>
  pointsProgram: ComputedRef<PointsIDLProgram>
  cargoProgram: ComputedRef<CargoIDLProgram>
}

let workspace: Workspace | undefined = undefined

export const useWorkspaceAdapter = (): Workspace | undefined => workspace

export const initWorkspaceAdapter = () => {
  const wallet = useAnchorWallet()

  const connection = computed(() => useRPCStore().connection as Connection)

  const provider = computed(
    () =>
      new AnchorProvider(connection.value, wallet.value!, {
        preflightCommitment,
        commitment,
      }),
  )

  const playerProfileProgram = computed(
    () => new Program(PLAYER_PROFILE_IDL, PLAYER_PROFILE_PROGRAM_ID, provider.value),
  )
  const profileFactionProgram = computed(
    () => new Program(PROFILE_FACTION_IDL, PROFILE_FACTION_PROGRAM_ID, provider.value),
  )

  const sageProgram = computed(() => new Program(SAGE_IDL, SAGE_PROGRAM_ID, provider.value))

  const pointsProgram = computed(() => new Program(POINTS_IDL, POINTS_PROGRAM_ID, provider.value))

  const cargoProgram = computed(() => new Program(CARGO_IDL, CARGO_PROGRAM_ID, provider.value))

  /*
    const cargoProgram = computed(() => new Program(CARGO_IDL, CARGO_PROGRAM_ID, provider.value))
    const crewProgram = computed(() => new Program(CREW_IDL, CREW_PROGRAM_ID, provider.value))

    const pointsProgram = computed(() => new Program(POINTS_IDL, POINTS_PROGRAM_ID, provider.value))*/

  console.log('[Loaded] Workspace')

  workspace = {
    wallet: wallet,
    connection: connection,
    provider: provider,
    playerProfileProgram: playerProfileProgram,
    profileFactionProgram: profileFactionProgram,
    sageProgram: sageProgram,
    pointsProgram: pointsProgram,
    cargoProgram: cargoProgram,
  } as Workspace
}
