import {
  AsyncSigner,
  createAssociatedTokenAccountIdempotent,
  stringToByteArray,
} from '@staratlas/data-source'
import { SagePlayerProfile, StarbasePlayer } from '@staratlas/sage/src'
import { BN } from '@staratlas/anchor'
import { useWorkspaceAdapter } from 'src/handler/connector'
import { findShipByMint, findStarbasePlayerAddress } from 'src/handler/interfaces/GameInterface'
import { useProfileStore } from 'stores/profileStore'
import { useGameStore } from 'stores/gameStore'
import { PublicKey } from '@solana/web3.js'
import {
  AddCrewToGameInput,
  AddShipEscrowInput,
  CrewTransferInput,
  CustomCreateFleetInput,
  Fleet,
  RemoveCrewFromGameInput,
  StarbaseDepositCargoToGameInput,
  StarbaseWithdrawCargoFromGameInput,
} from '@staratlas/sage'
import { findCargoPodAddress, findCargoTypeAddress } from 'src/handler/interfaces/CargoInterface'
import { checkAccountExists } from 'src/handler/helper/checkAccountExists'
import { useTokenStore } from 'stores/tokenStore'
import { getCrewProof } from 'stores/interfaces/cNFTInterface'

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

    const items = [
      {
        creatorHash: new PublicKey(crew!.compression.creator_hash),
        dataHash: new PublicKey(crew!.compression.data_hash),
        leafIndex: crew!.compression.leaf_id,
        merkleTree: proof.merkleTree,
        root: proof.root,
        proof: proof.proof.slice(0, 5),
      },
    ] as CrewTransferInput[]

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

    const crewDelegate = undefined

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
        crewDelegate,
      ),
    )

    return ixs
  }

  async withdrawCrewFromGameIx(id: string) {
    const ixs = []

    const crew = useTokenStore().gameCrewAccounts?.find((c) => c.id.toString() == id)
    const proof = await getCrewProof(new PublicKey(id))

    const items = [
      {
        creatorHash: new PublicKey(crew!.compression.creator_hash),
        dataHash: new PublicKey(crew!.compression.data_hash),
        leafIndex: crew!.compression.leaf_id,
        merkleTree: proof.merkleTree,
        root: proof.root,
        proof: proof.proof.slice(0, 5),
      },
    ] as CrewTransferInput[]

    const program = useWorkspaceAdapter()!.sageProgram.value!
    const key = this.signer
    const playerProfile = useProfileStore().playerProfileAddress!
    const profileFaction = useProfileStore().factionProfileAddress!
    const newCrewOwner = this.signer.publicKey()
    const starbasePlayer = findStarbasePlayerAddress()
    const starbase = useGameStore().starbase!.key
    const crewProgramConfig = new PublicKey('4ZaW8ecxSP13NTC9SyTTJ2s2s2jexp9cDwGuuZrphQcd')
    const gameId = useGameStore().gameID

    const input = {
      items: items,
      keyIndex: 0,
    } as RemoveCrewFromGameInput

    const crewDelegate = undefined

    ixs.push(
      SagePlayerProfile.removeCrewFromGame(
        program,
        key,
        playerProfile,
        profileFaction,
        newCrewOwner,
        starbasePlayer,
        starbase,
        crewProgramConfig,
        gameId,
        input,
        crewDelegate,
      ),
    )

    return ixs
  }

  createNewFleetIx(shipMint: PublicKey, shipAmount: number, fleetName: string) {
    if (!fleetName.length) throw Error('Fleet name can not be empty!')

    const ixs = []

    const shipAmountChunks = chunkShipAmounts(shipAmount)
    const fleetLabel = stringToByteArray(fleetName, 32)

    const program = useWorkspaceAdapter()!.sageProgram.value!
    const cargoProgram = useWorkspaceAdapter()!.cargoProgram.value!
    const key = this.signer
    const playerProfile = useProfileStore().playerProfileAddress!
    const profileFaction = useProfileStore().factionProfileAddress!
    const ship = findShipByMint(shipMint)!
    const starbasePlayer = findStarbasePlayerAddress()
    const starbase = useGameStore().starbase!.key
    const gameId = useGameStore().gameID
    const gameState = useGameStore().game!.data.gameState
    const cargoStatsDefinition = useGameStore().cargoStatsDefinition

    const input = {
      shipAmount: shipAmountChunks[0],
      shipEscrowIndex: 0,
      fleetLabel: fleetLabel,
      keyIndex: 0,
    } as CustomCreateFleetInput

    ixs.push(
      Fleet.createFleet(
        program,
        cargoProgram,
        key,
        playerProfile,
        profileFaction,
        ship,
        starbasePlayer,
        starbase,
        gameId,
        gameState,
        cargoStatsDefinition,
        input,
      ),
    )

    return ixs
  }
}

const chunkShipAmounts = (amount: number, max = 254) => {
  const chunks = [...Array(Math.floor(amount / max)).keys()].map(() => max)
  if (amount % max > 0) {
    chunks.push(amount % max)
  }
  return chunks
}
