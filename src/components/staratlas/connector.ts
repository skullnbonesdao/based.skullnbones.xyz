import type { ComputedRef, Ref } from 'vue'
import { computed } from 'vue'
import type { AnchorWallet } from 'solana-wallets-vue'
import { useAnchorWallet } from 'solana-wallets-vue'
import type { Connection } from '@solana/web3.js'
import { PublicKey } from '@solana/web3.js'
import { AnchorProvider, Program } from '@staratlas/anchor'
import { useRPCStore } from 'stores/rpcStore'
import type { PlayerProfileIDLProgram } from '@staratlas/player-profile'
import { PLAYER_PROFILE_IDL } from '@staratlas/player-profile'
import type { ProfileFactionIDLProgram } from '@staratlas/profile-faction'
import { PROFILE_FACTION_IDL } from '@staratlas/profile-faction'
import { SAGE_IDL, SageIDLProgram } from '@staratlas/sage'

const preflightCommitment = 'processed'
const commitment = 'confirmed'

export const PLAYER_PROFILE_PROGRAM_ID = new PublicKey(
  'pprofELXjL5Kck7Jn5hCpwAL82DpTkSYBENzahVtbc9',
)
export const PROFILE_FACTION_PROGRAM_ID = new PublicKey(
  'pFACSRuobDmvfMKq1bAzwj27t6d2GJhSCHb1VcfnRmq',
)

export const SAGE_PROGRAM_ID = new PublicKey('SAGE2HAwep459SNq61LHvjxPk4pLPEJLoMETef7f7EE')

export const GAME_ID = new PublicKey('GAMEzqJehF8yAnKiTARUuhZMvLvkZVAsCVri5vSfemLr')

//export const CREW_PROGRAM_ID = new PublicKey('')
//export const CARGO_PROGRAM_ID = new PublicKey('CArGoi989iv3VL3xArrJXmYYDNhjwCX5ey5sY5KKwMG')
//export const POINTS_PROGRAM_ID = new PublicKey('PointJfvuHi8DgGsPCy97EaZkQ6NvpghAAVkuquLf3w')

interface Workspace {
  wallet: Ref<AnchorWallet | undefined>
  connection: ComputedRef<Connection>
  provider: ComputedRef<AnchorProvider>

  playerProfileProgram: ComputedRef<PlayerProfileIDLProgram>
  profileFactionProgram: ComputedRef<ProfileFactionIDLProgram>
  sageProgram: ComputedRef<SageIDLProgram>
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
  } as Workspace
}
