import type { AsyncSigner } from '@staratlas/data-source'
import { createAssociatedTokenAccountIdempotent, readAllFromRPC } from '@staratlas/data-source'
import { SagePlayerProfile, StarbasePlayer } from '@staratlas/sage/src'
import { BN } from '@staratlas/anchor'
import { useWorkspaceAdapter } from 'src/handler/connector'
import { findShipByMint, findStarbasePlayerAddress } from 'src/handler/interfaces/GameInterface'
import { useProfileStore } from 'stores/profileStore'
import { useGameStore } from 'stores/gameStore'
import { PublicKey } from '@solana/web3.js'
import type {
  AddCrewToGameInput,
  AddShipEscrowInput,
  CrewTransferInput,
  StarbaseDepositCargoToGameInput,
  StarbaseWithdrawCargoFromGameInput,
} from '@staratlas/sage'
import { SageCrewConfig } from '@staratlas/sage'
import { findCargoPodAddress, findCargoTypeAddress } from 'src/handler/interfaces/CargoInterface'
import { checkAccountExists } from 'src/handler/helper/checkAccountExists'
import { useTokenStore } from 'stores/tokenStore'
import { getCrewProof } from 'stores/interfaces/cNFTInterface'
import { useRPCStore } from 'stores/rpcStore'

export class GameInstructionHandler {
  signer: AsyncSigner

  constructor(signer: AsyncSigner) {
    this.signer = signer
  }

  async depositShipToGameIx(mint: PublicKey, amount: number) {
    const ixs = []

    const tokenFROM = createAssociatedTokenAccountIdempotent(mint, this.signer.publicKey(), true)
    const tokenTO = createAssociatedTokenAccountIdempotent(
      mint,
      useProfileStore().sageProfileAddress!,
      true,
    )

    if (!(await checkAccountExists(tokenTO.address))) {
      ixs.push(tokenTO.instructions)
    }

    const program = useWorkspaceAdapter()!.sageProgram.value!
    const playerProfile = useProfileStore().playerProfileAddress!
    const profileFaction = useProfileStore().factionProfileAddress!
    const sagePlayerProfile = useProfileStore().sageProfileAddress!
    const signerShipOrigin = this.signer
    const originTokenAccount = tokenFROM.address
    const ship = findShipByMint(mint)
    const shipEscrowTokenAccount = tokenTO.address
    const starbasePlayer = findStarbasePlayerAddress()
    const starbase = useGameStore().starbase!.key
    const gameID = useGameStore().gameID
    const gameState = useGameStore().game!.data.gameState
    const input = {
      shipAmount: new BN(amount),
      index: null,
    } as AddShipEscrowInput

    ixs.push(
      SagePlayerProfile.addShipEscrow(
        program,
        playerProfile,
        profileFaction,
        sagePlayerProfile,
        signerShipOrigin,
        originTokenAccount,
        ship!,
        shipEscrowTokenAccount,
        starbasePlayer,
        starbase,
        gameID,
        gameState,
        input,
      ),
    )
    return ixs
  }

  async withdrawShipToGameIx(mint: PublicKey, amount: number) {
    const ixs = []

    const tokenFROM = createAssociatedTokenAccountIdempotent(
      mint,
      useProfileStore().sageProfileAddress!,
      true,
    )
    const tokenTO = createAssociatedTokenAccountIdempotent(mint, this.signer.publicKey(), true)

    if (!(await checkAccountExists(tokenTO.address))) {
      ixs.push(tokenTO.instructions)
    }

    const program = useWorkspaceAdapter()!.sageProgram.value!
    const key = this.signer
    const profile = useProfileStore().playerProfileAddress!
    const profileFaction = useProfileStore().factionProfileAddress!
    const sagePlayerProfile = useProfileStore().sageProfileAddress!
    const destinationTokenAccount = tokenTO.address
    const ship = findShipByMint(mint)
    const shipEscrowTokenAccount = tokenFROM.address
    const starbasePlayer = findStarbasePlayerAddress()
    const starbase = useGameStore().starbase!.key
    const gameID = useGameStore().gameID
    const gameState = useGameStore().game!.data.gameState
    const input = {
      shipAmount: new BN(amount),
      index: null,
    } as AddShipEscrowInput

    ixs.push(
      SagePlayerProfile.removeShipEscrow(
        program,
        key,
        profile,
        profileFaction,
        sagePlayerProfile,
        destinationTokenAccount,
        ship!,
        shipEscrowTokenAccount,
        starbasePlayer,
        starbase,
        gameID,
        gameState,
        input,
      ),
    )
    return ixs
  }

  async depositCargoToGameIx(mint: PublicKey, amount: number) {
    if (!mint) throw Error('mint can not be empty')
    if (!amount || amount == 0) throw Error('amount can not be empty')
    if (!useGameStore().starbase) throw Error('no starbase selected')
    const ixs = []

    const cargoPod = await findCargoPodAddress()

    const tokenFROM = createAssociatedTokenAccountIdempotent(mint, this.signer.publicKey(), true)
    const tokenTO = createAssociatedTokenAccountIdempotent(mint, cargoPod, true)

    if (!(await checkAccountExists(tokenTO.address))) {
      ixs.push(tokenTO.instructions)
    }

    const program = useWorkspaceAdapter()!.sageProgram.value!
    const cargoProgram = useWorkspaceAdapter()!.cargoProgram.value!

    const starbasePlayer = findStarbasePlayerAddress()
    const key = this.signer
    const playerProfile = useProfileStore().playerProfileAddress!
    const profileFaction = useProfileStore().factionProfileAddress!
    const starbase = useGameStore().starbase!.key
    const cargoStatsDefinition = useGameStore().cargoStatsDefinition
    const cargoType = findCargoTypeAddress(cargoStatsDefinition, mint)
    const tokenFrom = tokenFROM.address
    const tokenTo = tokenTO.address
    const gameId = useGameStore().gameID
    const gameState = useGameStore().game!.data.gameState
    const input = {
      amount: new BN(amount),
      keyIndex: 0,
    } as StarbaseDepositCargoToGameInput

    ixs.push(
      StarbasePlayer.depositCargoToGame(
        program,
        cargoProgram,
        starbasePlayer,
        key,
        playerProfile,
        profileFaction,
        starbase,
        cargoPod,
        cargoType,
        cargoStatsDefinition,
        tokenFrom,
        tokenTo,
        gameId,
        gameState,
        input,
      ),
    )

    return ixs
  }

  async withdrawCargoFromGameIx(mint: PublicKey, amount: number) {
    if (!mint) throw Error('mint can not be empty')
    if (!amount || amount == 0) throw Error('amount can not be empty')
    if (!useGameStore().starbase) throw Error('no starbase selected')
    const ixs = []

    const cargoPod = await findCargoPodAddress()

    const tokenFROM = createAssociatedTokenAccountIdempotent(mint, cargoPod, true)
    const tokenTO = createAssociatedTokenAccountIdempotent(mint, this.signer.publicKey(), true)

    if (!(await checkAccountExists(tokenTO.address))) {
      ixs.push(tokenTO.instructions)
    }

    const program = useWorkspaceAdapter()!.sageProgram.value!
    const cargoProgram = useWorkspaceAdapter()!.cargoProgram.value!

    const starbasePlayer = findStarbasePlayerAddress()
    const key = this.signer
    const fundsTo = this.signer.publicKey()
    const playerProfile = useProfileStore().playerProfileAddress!
    const profileFaction = useProfileStore().factionProfileAddress!
    const starbase = useGameStore().starbase!.key
    const cargoStatsDefinition = useGameStore().cargoStatsDefinition
    const cargoType = findCargoTypeAddress(cargoStatsDefinition, mint)
    const tokenFrom = tokenFROM.address
    const tokenTo = tokenTO.address
    const tokenMint = mint
    const gameId = useGameStore().gameID
    const gameState = useGameStore().game!.data.gameState
    const input = {
      amount: new BN(amount),
      keyIndex: 0,
    } as StarbaseWithdrawCargoFromGameInput

    ixs.push(
      StarbasePlayer.withdrawCargoFromGame(
        program,
        cargoProgram,
        starbasePlayer,
        key,
        fundsTo,
        playerProfile,
        profileFaction,
        starbase,
        cargoPod,
        cargoType,
        cargoStatsDefinition,
        tokenFrom,
        tokenTo,
        tokenMint,
        gameId,
        gameState,
        input,
      ),
    )

    return ixs
  }

  async depositCrewToGameIx(id: string) {
    const ixs = []

    const crew = useTokenStore().walletCrewAccounts?.find((c) => c.id.toString() == id)
    const proof = await getCrewProof(new PublicKey(id))

    console.log('crew', crew)
    console.log('proof', proof)

    const items = [
      {
        merkleTree: new PublicKey(proof.tree_id),
        creatorHash: new PublicKey(crew!.compression.creator_hash),
        root: new PublicKey(proof.root),
        dataHash: new PublicKey(id),
        leafIndex: proof.node_index,
        proof: proof.proof.flatMap((p) => new PublicKey(p)),
      },
    ] as CrewTransferInput[]

    console.log('items', items)

    const crewConfig = await readAllFromRPC(
      useRPCStore().connection,
      useWorkspaceAdapter()?.sageProgram.value!,
      SageCrewConfig,
      'confirmed',
    )

    console.log('crewConfig', crewConfig)

    const program = useWorkspaceAdapter()!.sageProgram.value!
    const playerProfile = useProfileStore().playerProfileAddress!
    const profileFaction = useProfileStore().factionProfileAddress!
    const crewOwner = this.signer
    const starbasePlayer = findStarbasePlayerAddress()
    const starbase = useGameStore().starbase!.key
    const crewProgramConfig = new PublicKey('4ZaW8ecxSP13NTC9SyTTJ2s2s2jexp9cDwGuuZrphQcd')
    const gameId = useGameStore().gameID

    const input = {
      items: items,
    } as AddCrewToGameInput

    //const crewDelegate = getSigner()

    ixs.push(
      SagePlayerProfile.addCrewToGame(
        program,
        playerProfile,
        profileFaction,
        crewOwner,
        starbasePlayer,
        starbase,
        crewProgramConfig,
        gameId,
        input,
      ),
    )

    return ixs
  }
}
