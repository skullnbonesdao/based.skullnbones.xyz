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
  AddShipToFleetInput,
  CrewTransferInput,
  CustomCreateFleetInput,
  Fleet,
  RemoveCrewFromGameInput,
  RemoveShipEscrowInput,
  StarbaseDepositCargoToGameInput,
  StarbaseWithdrawCargoFromGameInput,
  WrappedShipEscrow,
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

    const signerShipOrigin = this.signer
    const originTokenAccount = tokenFROM.address
    const ship = findShipByMint(mint)
    const shipEscrowTokenAccount = tokenTO.address

    const input = {
      shipAmount: new BN(amount),
      index: null,
    } as AddShipEscrowInput

    ixs.push(
      SagePlayerProfile.addShipEscrow(
        this.getSageProgram(),
        this.getPlayerProfileAddress(),
        this.getProfileFactionAddress(),
        this.getSageProfileAddress(),
        signerShipOrigin,
        originTokenAccount,
        ship!,
        shipEscrowTokenAccount,
        this.getStarbasePlayerAddress(),
        this.getStarbaseAddress(),
        this.getGameId(),
        this.getGameState(),
        input,
      ),
    )
    return ixs
  }

  async withdrawShipFromGameIx(shipMint: PublicKey, amount: number) {
    const ixs = []

    let amountIncluded = 0
    let amountToTransfer = 0

    while (amountIncluded < amount) {
      console.log('hello')
      const wrappedShipEscrow = this.getShipEscrow(shipMint)

      amountToTransfer =
        wrappedShipEscrow!.amount.toNumber() > amount
          ? amount
          : wrappedShipEscrow!.amount.toNumber()

      const tokenFROM = createAssociatedTokenAccountIdempotent(
        shipMint,
        useProfileStore().sageProfileAddress!,
        true,
      )
      const tokenTO = createAssociatedTokenAccountIdempotent(
        shipMint,
        this.signer.publicKey(),
        true,
      )

      if (!(await checkAccountExists(tokenTO.address))) {
        ixs.push(tokenTO.instructions)
      }

      const destinationTokenAccount = tokenTO.address
      const ship = findShipByMint(shipMint)!
      const shipEscrowTokenAccount = tokenFROM.address

      const input = {
        shipAmount: new BN(amountToTransfer),
        permissionKeyIndex: 0,
        shipEscrowIndex: this.getShipEscrowIndex(ship, wrappedShipEscrow),
      } as RemoveShipEscrowInput

      ixs.push(
        SagePlayerProfile.removeShipEscrow(
          this.getSageProgram(),
          this.signer,
          this.getPlayerProfileAddress(),
          this.getProfileFactionAddress(),
          this.getSageProfileAddress(),
          destinationTokenAccount,
          ship,
          shipEscrowTokenAccount,
          this.getStarbasePlayerAddress(),
          this.getStarbaseAddress(),
          this.getGameId(),
          this.getGameState(),
          input,
        ),
      )
      amountIncluded += amountToTransfer
    }
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

    const key = this.signer
    const cargoStatsDefinition = useGameStore().cargoStatsDefinition
    const cargoType = findCargoTypeAddress(cargoStatsDefinition, mint)
    const tokenFrom = tokenFROM.address
    const tokenTo = tokenTO.address

    const input = {
      amount: new BN(amount),
      keyIndex: 0,
    } as StarbaseDepositCargoToGameInput

    ixs.push(
      StarbasePlayer.depositCargoToGame(
        this.getSageProgram(),
        this.getCargoProgram(),
        this.getStarbasePlayerAddress(),
        key,
        this.getPlayerProfileAddress(),
        this.getProfileFactionAddress(),
        this.getStarbaseAddress(),
        cargoPod,
        cargoType,
        cargoStatsDefinition,
        tokenFrom,
        tokenTo,
        this.getGameId(),
        this.getGameState(),
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

    const key = this.signer
    const fundsTo = this.signer.publicKey()
    const cargoStatsDefinition = useGameStore().cargoStatsDefinition
    const cargoType = findCargoTypeAddress(cargoStatsDefinition, mint)
    const tokenFrom = tokenFROM.address
    const tokenTo = tokenTO.address
    const tokenMint = mint
    const input = {
      amount: new BN(amount),
      keyIndex: 0,
    } as StarbaseWithdrawCargoFromGameInput

    ixs.push(
      StarbasePlayer.withdrawCargoFromGame(
        this.getSageProgram(),
        this.getCargoProgram(),
        this.getStarbasePlayerAddress(),
        key,
        fundsTo,
        this.getPlayerProfileAddress(),
        this.getProfileFactionAddress(),
        this.getStarbaseAddress(),
        cargoPod,
        cargoType,
        cargoStatsDefinition,
        tokenFrom,
        tokenTo,
        tokenMint,
        this.getGameId(),
        this.getGameState(),
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

    const crewOwner = this.signer
    const crewProgramConfig = new PublicKey('4ZaW8ecxSP13NTC9SyTTJ2s2s2jexp9cDwGuuZrphQcd')

    const input = {
      items: items,
    } as AddCrewToGameInput

    const crewDelegate = undefined

    ixs.push(
      SagePlayerProfile.addCrewToGame(
        this.getSageProgram(),
        this.getPlayerProfileAddress(),
        this.getProfileFactionAddress(),
        crewOwner,
        this.getStarbasePlayerAddress(),
        this.getStarbaseAddress(),
        crewProgramConfig,
        this.getGameId(),
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

    const newCrewOwner = this.signer.publicKey()
    const crewProgramConfig = new PublicKey('4ZaW8ecxSP13NTC9SyTTJ2s2s2jexp9cDwGuuZrphQcd')

    const input = {
      items: items,
      keyIndex: 0,
    } as RemoveCrewFromGameInput

    const crewDelegate = undefined

    ixs.push(
      SagePlayerProfile.removeCrewFromGame(
        this.getSageProgram(),
        this.signer,
        this.getPlayerProfileAddress(),
        this.getProfileFactionAddress(),
        newCrewOwner,
        this.getStarbasePlayerAddress(),
        this.getStarbaseAddress(),
        crewProgramConfig,
        this.getGameId(),
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

    const input = {
      shipAmount: shipAmountChunks[0],
      shipEscrowIndex: 0,
      fleetLabel: fleetLabel,
      keyIndex: 0,
    } as CustomCreateFleetInput

    const createFleet = Fleet.createFleet(
      this.getSageProgram(),
      this.getCargoProgram(),
      this.signer,
      this.getPlayerProfileAddress(),
      this.getProfileFactionAddress(),
      findShipByMint(shipMint)!,
      findStarbasePlayerAddress(),
      this.getStarbaseAddress(),
      this.getGameId(),
      this.getGameState(),
      this.getCargoStatsDefinition(),
      input,
    )

    ixs.push(createFleet.instructions)

    return ixs
  }

  addShipsToFleetIx(fleet: PublicKey, shipMint: PublicKey, shipAmount: number) {
    const ixs = []

    const wrappedShipEscrow = this.getShipEscrow(shipMint)
    const ship = findShipByMint(shipMint)!

    const input = {
      shipAmount: shipAmount,
      shipEscrowIndex: this.getShipEscrowIndex(ship, wrappedShipEscrow),
      fleetShipInfoIndex: null,
      keyIndex: 0,
    } as AddShipToFleetInput

    ixs.push(
      Fleet.addShipToFleet(
        this.getSageProgram(),
        this.signer,
        this.getPlayerProfileAddress(),
        this.getProfileFactionAddress(),
        fleet,
        findShipByMint(shipMint)!,
        findStarbasePlayerAddress(),
        this.getStarbaseAddress(),
        this.getGameId(),
        this.getGameState(),
        input,
      ),
    )

    return ixs
  }

  private getSageProgram = () =>
    useWorkspaceAdapter()?.sageProgram.value ??
    (() => {
      throw new Error('no sageProgram set')
    })()

  private getCargoProgram = () =>
    useWorkspaceAdapter()?.cargoProgram.value ??
    (() => {
      throw new Error('no cargoProgram set')
    })()

  private getPlayerProfileAddress = () =>
    useProfileStore()?.playerProfileAddress ??
    (() => {
      throw new Error('no playerProfileAddress set')
    })()

  private getSageProfileAddress = () =>
    useProfileStore()?.sageProfileAddress ??
    (() => {
      throw new Error('no sageProfileAddress set')
    })()

  private getProfileFactionAddress = () =>
    useProfileStore()?.factionProfileAddress ??
    (() => {
      throw new Error('no factionProfileAddress set')
    })()

  private getStarbaseAddress = () =>
    useGameStore().starbase!.key ??
    (() => {
      throw new Error('no starbase set')
    })()

  private getStarbasePlayerAddress = () =>
    findStarbasePlayerAddress() ??
    (() => {
      throw new Error('no starbase set')
    })()

  private getGameId = () =>
    useGameStore().gameID ??
    (() => {
      throw new Error('no gameId set')
    })()

  private getGameState = () =>
    useGameStore().game!.data.gameState ??
    (() => {
      throw new Error('no gameState set')
    })()

  private getCargoStatsDefinition = () =>
    useGameStore().cargoStatsDefinition ??
    (() => {
      throw new Error('no cargoStatsDefinition set')
    })()

  private getShipEscrow = (shipMint: PublicKey) =>
    useTokenStore()
      .gameTokenAccounts?.filter((gTA) => gTA.itemType == 'ship')
      ?.find((gTA) => gTA.mint.toString() == shipMint.toString())
      ?.wrappedShipEscrows.sort((a, b) => a.amount.toNumber() - b.amount.toNumber())
      .at(0) ??
    (() => {
      throw new Error('no shipEscrow set')
    })()

  private getShipEscrowIndex = (ship: PublicKey, wrappedShipEscrow: WrappedShipEscrow) =>
    useGameStore().starbasePlayer?.wrappedShipEscrows.findIndex(
      (wse) => wse.ship.toString() == ship?.toString() && wse.amount == wrappedShipEscrow?.amount,
    ) ??
    (() => {
      throw new Error('no getShipEscrowIndex set')
    })()
}

const chunkShipAmounts = (amount: number, max = 254) => {
  const chunks = [...Array(Math.floor(amount / max)).keys()].map(() => max)
  if (amount % max > 0) {
    chunks.push(amount % max)
  }
  return chunks
}
