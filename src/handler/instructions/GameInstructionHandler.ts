import {
  AsyncSigner,
  createAssociatedTokenAccountIdempotent,
  readFromRPCOrError,
  stringToByteArray,
} from '@staratlas/data-source'
import {
  FleetShips,
  Game,
  MineItem,
  Resource,
  SagePlayerProfile,
  StarbasePlayer,
} from '@staratlas/sage/src'
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
  DisbandedFleet,
  Fleet,
  RemoveCrewFromGameInput,
  RemoveShipEscrowInput,
  StarbaseDepositCargoToGameInput,
  StarbaseWithdrawCargoFromGameInput,
} from '@staratlas/sage'
import { findCargoPodAddress, findCargoTypeAddress } from 'src/handler/interfaces/CargoInterface'
import { checkAccountExists } from 'src/handler/helper/checkAccountExists'
import { useTokenStore } from 'stores/tokenStore'
import { getCrewProof } from 'stores/interfaces/cNFTInterface'
import { useRPCStore } from 'stores/rpcStore'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import { CargoType } from '@staratlas/cargo'
import { UserPoints } from '@staratlas/points'
import { usePlayerStore } from 'stores/playerStore'
import type { cNFT } from 'stores/interfaces/cNFT'

export class GameInstructionHandler {
  signer: AsyncSigner

  constructor(signer: AsyncSigner) {
    this.signer = signer
  }

  async depositShipToGameIx(shipMint: PublicKey, amount: number) {
    const ixs = []

    const tokenFROM = createAssociatedTokenAccountIdempotent(
      shipMint,
      this.signer.publicKey(),
      true,
    )

    const tokenTO = createAssociatedTokenAccountIdempotent(
      shipMint,
      useProfileStore().sageProfileAddress!,
      true,
    )

    if (!(await checkAccountExists(tokenTO.address))) {
      ixs.push(tokenTO.instructions)
    }

    const signerShipOrigin = this.signer
    const originTokenAccount = tokenFROM.address
    const ship = this.getShipByMint(shipMint)
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
      const shipEscrowTokenAccount = tokenFROM.address

      const input = {
        shipAmount: new BN(amountToTransfer),
        permissionKeyIndex: 0,
        shipEscrowIndex: this.getShipEscrowIndex(shipMint),
      } as RemoveShipEscrowInput

      ixs.push(
        SagePlayerProfile.removeShipEscrow(
          this.getSageProgram(),
          this.signer,
          this.getPlayerProfileAddress(),
          this.getProfileFactionAddress(),
          this.getSageProfileAddress(),
          destinationTokenAccount,
          this.getShipByMint(shipMint),
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
    if (!usePlayerStore().currentStarbase) throw Error('no starbase selected')
    const ixs = []

    const cargoPod = await findCargoPodAddress()

    const tokenFROM = createAssociatedTokenAccountIdempotent(mint, this.signer.publicKey(), true)
    const tokenTO = createAssociatedTokenAccountIdempotent(mint, cargoPod, true)

    if (!(await checkAccountExists(tokenTO.address))) {
      ixs.push(tokenTO.instructions)
    }

    const key = this.signer

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
        this.getCargoType(mint),
        this.getCargoStatsDefinition(),
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
    if (!usePlayerStore().currentStarbase) throw Error('no starbase selected')
    const ixs = []

    const cargoPod = await findCargoPodAddress()

    const tokenFROM = createAssociatedTokenAccountIdempotent(mint, cargoPod, true)
    const tokenTO = createAssociatedTokenAccountIdempotent(mint, this.signer.publicKey(), true)

    if (!(await checkAccountExists(tokenTO.address))) {
      ixs.push(tokenTO.instructions)
    }

    const key = this.signer
    const fundsTo = this.signer.publicKey()

    const cargoType = findCargoTypeAddress(this.getCargoStatsDefinition(), mint)
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
        this.getCargoStatsDefinition(),
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

  async depositCrewToGameIx(crew: cNFT) {
    const ixs = []

    const proof = await getCrewProof(new PublicKey(crew.id))

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

  async withdrawCrewFromGameIx(crew: cNFT) {
    const ixs = []

    const proof = await getCrewProof(new PublicKey(crew.id))

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
      shipEscrowIndex: this.getShipEscrowIndex(shipMint),
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

  addShipsToFleetIx(fleetKey: PublicKey, shipMint: PublicKey, shipAmount: number) {
    const ixs = []

    console.log('fleetKey', fleetKey.toString())
    console.log('shipMint', shipMint.toString())
    console.log('shipAmount', shipAmount)
    console.log(this.getShipEscrowIndex(shipMint))

    const input = {
      shipAmount: shipAmount,
      shipEscrowIndex: this.getShipEscrowIndex(shipMint),
      fleetShipInfoIndex: null,
      keyIndex: 0,
    } as AddShipToFleetInput

    ixs.push(
      Fleet.addShipToFleet(
        this.getSageProgram(),
        this.signer,
        this.getPlayerProfileAddress(),
        this.getProfileFactionAddress(),
        fleetKey,
        this.getShipByMint(shipMint),
        findStarbasePlayerAddress(),
        this.getStarbaseAddress(),
        this.getGameId(),
        this.getGameState(),
        input,
      ),
    )

    return ixs
  }

  async disbandFleetIx(fleetKey: PublicKey) {
    const ixs = []

    const fleet = await readFromRPCOrError(
      useRPCStore().connection,
      useWorkspaceAdapter()!.sageProgram.value!,
      fleetKey,
      Fleet,
      'confirmed',
    )

    const disbandFleet = Fleet.disbandFleet(
      this.getSageProgram(),
      this.getCargoProgram(),
      this.signer,
      this.getPlayerProfileAddress(),
      this.getProfileFactionAddress(),
      fleet,

      findStarbasePlayerAddress(),
      this.getStarbaseAddress(),
      this.getGameId(),
      this.getGameState(),
      {
        keyIndex: 0,
      },
    )

    ixs.push(disbandFleet.instructions)

    const fleetShipsKey = FleetShips.findAddress(this.getSageProgram(), fleetKey)[0]
    const fleetShips = await readFromRPCOrError(
      useRPCStore().connection,
      this.getSageProgram(),
      fleetShipsKey,
      FleetShips,
    )

    fleetShips.fleetShips.forEach((fleetShip) => {
      ixs.push(
        DisbandedFleet.disbandedFleetToEscrow(
          this.getSageProgram(),
          this.signer,
          this.getPlayerProfileAddress(),
          this.getProfileFactionAddress(),
          disbandFleet.disbandedFleetKey[0],
          fleetShipsKey,
          fleetShip.ship,
          this.getStarbasePlayerAddress(),
          this.getStarbaseAddress(),
          this.getGameId(),
          this.getGameState(),
          {
            fleetShipInfoIndex: 0,
            shipAmount: fleetShip.amount.toNumber(),
            shipEscrowIndex: null,
            keyIndex: 0,
          },
        ),
      )
    })

    ixs.push(
      DisbandedFleet.closeDisbandedFleet(
        this.getSageProgram(),
        this.signer,
        this.getPlayerProfileAddress(),
        'funder',
        disbandFleet.disbandedFleetKey[0],
        fleetShipsKey,
        {
          keyIndex: 0,
        },
      ),
    )

    ixs.push(
      StarbasePlayer.removeCargoPod(
        this.getSageProgram(),
        this.getCargoProgram(),
        this.getStarbasePlayerAddress(),
        this.signer,
        this.getPlayerProfileAddress(),
        this.getProfileFactionAddress(),
        'funder',
        this.getStarbaseAddress(),
        fleet.data.ammoBank,
        this.getGameId(),
        this.getGameState(),
        {
          keyIndex: 0,
        },
      ),
    )

    ixs.push(
      StarbasePlayer.removeCargoPod(
        this.getSageProgram(),
        this.getCargoProgram(),
        this.getStarbasePlayerAddress(),
        this.signer,
        this.getPlayerProfileAddress(),
        this.getProfileFactionAddress(),
        'funder',
        this.getStarbaseAddress(),
        fleet.data.cargoHold,
        this.getGameId(),
        this.getGameState(),
        {
          keyIndex: 0,
        },
      ),
    )

    ixs.push(
      StarbasePlayer.removeCargoPod(
        this.getSageProgram(),
        this.getCargoProgram(),
        this.getStarbasePlayerAddress(),
        this.signer,
        this.getPlayerProfileAddress(),
        this.getProfileFactionAddress(),
        'funder',
        this.getStarbaseAddress(),
        fleet.data.fuelTank,
        this.getGameId(),
        this.getGameState(),
        {
          keyIndex: 0,
        },
      ),
    )

    return ixs
  }

  async cargoToFleetIx(fleetKey: PublicKey, tokenMint: PublicKey, amount: number) {
    const ixs = []

    const fleet = await readFromRPCOrError(
      useRPCStore().connection,
      useWorkspaceAdapter()!.sageProgram.value!,
      fleetKey,
      Fleet,
      'confirmed',
    )

    const cargoSymbol = useTokenStore().tokenList.find(
      (t) => t.mint == tokenMint.toString(),
    )!.symbol

    const cargoPodFROM = await findCargoPodAddress()
    let cargoPodTO
    let tokenFROM
    let tokenTO

    switch (cargoSymbol) {
      case 'FUEL':
        cargoPodTO = fleet.data.fuelTank
        tokenFROM = createAssociatedTokenAccountIdempotent(tokenMint, cargoPodFROM, true)
        tokenTO = createAssociatedTokenAccountIdempotent(tokenMint, cargoPodTO, true)
        break
      case 'AMMO':
        cargoPodTO = fleet.data.ammoBank
        tokenFROM = createAssociatedTokenAccountIdempotent(tokenMint, cargoPodFROM, true)
        tokenTO = createAssociatedTokenAccountIdempotent(tokenMint, cargoPodTO, true)
        break

      default:
        cargoPodTO = fleet.data.cargoHold
        tokenFROM = createAssociatedTokenAccountIdempotent(tokenMint, cargoPodFROM, true)
        tokenTO = createAssociatedTokenAccountIdempotent(tokenMint, cargoPodTO, true)
        break
    }

    console.log('cargoPodFROM', cargoPodFROM.toString())
    console.log('cargoPodTO', cargoPodTO.toString())
    console.log('tokenFROM', tokenFROM.address.toString())
    console.log('tokenTO', tokenTO.address.toString())

    if (!(await checkAccountExists(tokenTO.address))) {
      ixs.push(tokenTO.instructions)
    }

    ixs.push(
      Fleet.depositCargoToFleet(
        this.getSageProgram(),
        this.getCargoProgram(),
        this.signer,
        this.getPlayerProfileAddress(),
        this.getProfileFactionAddress(),
        'funder',
        this.getStarbaseAddress(),
        this.getStarbasePlayerAddress(),
        fleetKey,
        cargoPodFROM,
        cargoPodTO,
        this.getCargoType(tokenMint),
        this.getCargoStatsDefinition(),
        tokenFROM.address,
        tokenTO.address,
        tokenMint,
        this.getGameId(),
        this.getGameState(),
        {
          amount: new BN(amount),
          keyIndex: 0,
        },
      ),
    )
    return ixs
  }

  async cargoToStarbaseIx(fleetKey: PublicKey, tokenMint: PublicKey, amount: number) {
    const ixs = []

    const fleet = await readFromRPCOrError(
      useRPCStore().connection,
      useWorkspaceAdapter()!.sageProgram.value!,
      fleetKey,
      Fleet,
      'confirmed',
    )

    const cargoSymbol = useTokenStore().tokenList.find(
      (t) => t.mint == tokenMint.toString(),
    )!.symbol

    let cargoPodFROM
    const cargoPodTO = await findCargoPodAddress()
    let tokenFROM
    let tokenTO

    switch (cargoSymbol) {
      case 'FUEL':
        cargoPodFROM = fleet.data.fuelTank
        tokenFROM = createAssociatedTokenAccountIdempotent(tokenMint, cargoPodFROM, true)
        tokenTO = createAssociatedTokenAccountIdempotent(tokenMint, cargoPodTO, true)
        break
      case 'AMMO':
        cargoPodFROM = fleet.data.ammoBank
        tokenFROM = createAssociatedTokenAccountIdempotent(tokenMint, cargoPodFROM, true)
        tokenTO = createAssociatedTokenAccountIdempotent(tokenMint, cargoPodTO, true)
        break

      default:
        cargoPodFROM = fleet.data.cargoHold
        tokenFROM = createAssociatedTokenAccountIdempotent(tokenMint, cargoPodFROM, true)
        tokenTO = createAssociatedTokenAccountIdempotent(tokenMint, cargoPodTO, true)
        break
    }

    console.log('cargoPodFROM', cargoPodFROM.toString())
    console.log('cargoPodTO', cargoPodTO.toString())
    console.log('tokenFROM', tokenFROM.address.toString())
    console.log('tokenTO', tokenTO.address.toString())

    if (!(await checkAccountExists(tokenTO.address))) {
      ixs.push(tokenTO.instructions)
    }

    ixs.push(
      Fleet.withdrawCargoFromFleet(
        this.getSageProgram(),
        this.getCargoProgram(),
        this.signer,
        'funder',
        this.getPlayerProfileAddress(),
        this.getProfileFactionAddress(),

        this.getStarbaseAddress(),
        this.getStarbasePlayerAddress(),
        fleetKey,
        cargoPodFROM,
        cargoPodTO,
        this.getCargoType(tokenMint),
        this.getCargoStatsDefinition(),
        tokenFROM.address,
        tokenTO.address,
        tokenMint,
        this.getGameId(),
        this.getGameState(),
        {
          amount: new BN(amount),
          keyIndex: 0,
        },
      ),
    )
    return ixs
  }

  async fleetUndock(fleetKey: PublicKey) {
    const ixs = []

    ixs.push(
      Fleet.loadingBayToIdle(
        this.getSageProgram(),
        this.signer,
        this.getPlayerProfileAddress(),
        this.getProfileFactionAddress(),
        fleetKey,
        this.getStarbaseAddress(),
        this.getStarbasePlayerAddress(),
        this.getGameId(),
        this.getGameState(),
        0,
      ),
    )
    return ixs
  }

  async fleetDock(fleetKey: PublicKey) {
    const ixs = []

    ixs.push(
      Fleet.idleToLoadingBay(
        this.getSageProgram(),
        this.signer,
        this.getPlayerProfileAddress(),
        this.getProfileFactionAddress(),
        fleetKey,
        this.getStarbaseAddress(),
        this.getStarbasePlayerAddress(),
        this.getGameId(),
        this.getGameState(),
        0,
      ),
    )
    return ixs
  }

  async startMining(fleetKey: PublicKey) {
    const ixs = []

    const planet = this.getPlanetAddressByFleetKey(fleetKey)
    const resource = this.getResourceByPlanetKey(planet)
    const resourceKey = resource?.key
    const mineItemKey = resource?.data.mineItem

    ixs.push(
      Fleet.startMiningAsteroid(
        this.getSageProgram(),
        this.signer,
        this.getPlayerProfileAddress(),
        this.getProfileFactionAddress(),
        fleetKey,
        this.getStarbaseAddress(),
        this.getStarbasePlayerAddress(),
        mineItemKey,
        resourceKey,
        planet,
        this.getGameState(),
        this.getGameId(),
        this.getFuelTokenAccountByFleetKey(fleetKey),
        {
          keyIndex: 0,
        },
      ),
    )
    return ixs
  }

  async asteroidMiningHandler(fleetKey: PublicKey) {
    const ixs = []
    const planet = new PublicKey('AEE2o2CH7mGqaxA5aD3yhWwCHatmYxopnNevvMTcHS9C')

    const fuelMint = this.getMintBySymbol('FUEL')
    const foodMint = this.getMintBySymbol('FOOD')
    const ammoMint = this.getMintBySymbol('AMMO')
    const resourceMint = this.getMintBySymbol('HYG')

    const feetFuelTank = this.getFleetByKey(fleetKey)?.data.fuelTank
    const fleetCargoHold = this.getFleetByKey(fleetKey)?.data.cargoHold
    const fleetAmmoBank = this.getFleetByKey(fleetKey)?.data.ammoBank

    const fleetFuelToken = createAssociatedTokenAccountIdempotent(
      fuelMint,
      this.getFuelTokenAccountByFleetKey(fleetKey),
      true,
    )

    const mineItemKey = this.getMineItemAddress(resourceMint)
    const resourceKey = this.getResourceAddress(mineItemKey, planet)
    const fleetFoodToken = createAssociatedTokenAccountIdempotent(foodMint, fleetCargoHold, true)
    const fleetAmmoToken = createAssociatedTokenAccountIdempotent(ammoMint, fleetAmmoBank, true)
    const resourceTokenFrom = createAssociatedTokenAccountIdempotent(
      resourceMint,
      mineItemKey,
      true,
    )
    const resourceTokenTo = createAssociatedTokenAccountIdempotent(
      resourceMint,
      fleetCargoHold,
      true,
    )

    if (!(await checkAccountExists(fleetFoodToken.address))) {
      ixs.push(fleetFoodToken.instructions)
    }
    if (!(await checkAccountExists(fleetAmmoToken.address))) {
      ixs.push(fleetAmmoToken.instructions)
    }
    if (!(await checkAccountExists(resourceTokenFrom.address))) {
      ixs.push(resourceTokenFrom.instructions)
    }
    if (!(await checkAccountExists(resourceTokenTo.address))) {
      ixs.push(resourceTokenTo.instructions)
    }

    ixs.push(
      Fleet.asteroidMiningHandler(
        this.getSageProgram(),
        this.getCargoProgram(),
        fleetKey,
        this.getStarbaseAddress(),
        mineItemKey,
        resourceKey,
        planet,
        fleetCargoHold,
        fleetAmmoBank,
        this.getCargoTypeAddress(foodMint),
        this.getCargoTypeAddress(ammoMint),
        this.getCargoTypeAddress(resourceMint),
        this.getCargoStatsDefinition(),
        this.getGameState(),
        this.getGameId(),
        fleetFoodToken.address,
        fleetAmmoToken.address,
        resourceTokenFrom.address,
        resourceTokenTo.address,
        foodMint,
        ammoMint,
      ),
    )

    return ixs
  }

  async stopMining(fleetKey: PublicKey) {
    const ixs = []

    const planet = new PublicKey('AEE2o2CH7mGqaxA5aD3yhWwCHatmYxopnNevvMTcHS9C')

    const resourceMint = this.getMintBySymbol('HYG')
    const fuelMint = this.getMintBySymbol('FUEL')

    const mineItemKey = this.getMineItemAddress(resourceMint)
    const resourceKey = this.getResourceAddress(mineItemKey, planet)

    const fleetFuelTank = this.getFleetByKey(fleetKey)?.data.fuelTank

    const fleetFuelToken = createAssociatedTokenAccountIdempotent(fuelMint, fleetFuelTank, true)

    if (!(await checkAccountExists(fleetFuelToken.address))) {
      ixs.push(fleetFuelToken.instructions)
    }

    const a = [
      this.getSageProgram(),
      this.getCargoProgram(),
      this.getPointsProgram(),
      this.signer,
      this.getPlayerProfileAddress(),
      this.getProfileFactionAddress(),
      fleetKey,
      mineItemKey,
      resourceKey,
      planet,
      fleetFuelTank,
      this.getCargoTypeAddress(resourceMint),
      this.getCargoStatsDefinition(),

      this.getUserPointsAccountAddress(this.getMiningXpCategory()),
      this.getMiningXpCategory(),
      this.getPointsModifierAddress(this.getMiningXpCategory()),

      this.getUserPointsAccountAddress(this.getPilotXpCategory()),
      this.getPilotXpCategory(),
      this.getPointsModifierAddress(this.getPilotXpCategory()),

      this.getUserPointsAccountAddress(this.getCouncilRankXpCategory()),
      this.getCouncilRankXpCategory(),
      this.getPointsModifierAddress(this.getCouncilRankXpCategory()),

      this.getGameState(),
      this.getGameId(),
      fleetFuelToken.address,
      fuelMint,
    ]
    a.forEach((a) => console.log(a.toString()))

    ixs.push(
      Fleet.stopMiningAsteroid(
        this.getSageProgram(),
        this.getCargoProgram(),
        this.getPointsProgram(),
        this.signer,
        this.getPlayerProfileAddress(),
        this.getProfileFactionAddress(),
        fleetKey,
        mineItemKey,
        resourceKey,
        planet,
        fleetFuelTank,
        this.getCargoTypeAddress(fuelMint),
        this.getCargoStatsDefinition(),

        this.getUserPointsAccountAddress(this.getMiningXpCategory()),
        this.getMiningXpCategory(),
        this.getPointsModifierAddress(this.getMiningXpCategory()),

        this.getUserPointsAccountAddress(this.getPilotXpCategory()),
        this.getPilotXpCategory(),
        this.getPointsModifierAddress(this.getPilotXpCategory()),

        this.getUserPointsAccountAddress(this.getCouncilRankXpCategory()),
        this.getCouncilRankXpCategory(),
        this.getPointsModifierAddress(this.getCouncilRankXpCategory()),

        this.getGameState(),
        this.getGameId(),
        fleetFuelToken.address,
        fuelMint,
        { keyIndex: 0 },
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

  private getPointsProgram = () =>
    useWorkspaceAdapter()?.pointsProgram.value ??
    (() => {
      throw new Error('no pointsProgram set')
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
    usePlayerStore().currentStarbase?.key ??
    (() => {
      throw new Error('no starbase set')
    })()

  private getStarbasePlayerAddress = () =>
    findStarbasePlayerAddress() ??
    (() => {
      throw new Error('no starbasePlayerAddress found')
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

  private getCargoType = (mint: PublicKey) =>
    findCargoTypeAddress(this.getCargoStatsDefinition(), mint) ??
    (() => {
      throw new Error('no cargoStatsDefinition set')
    })()

  private getShipByMint = (shipMint: PublicKey) =>
    findShipByMint(shipMint) ??
    (() => {
      throw new Error('no ship found')
    })()

  private getShipEscrow = (shipMint: PublicKey) =>
    usePlayerStore()
      .starbaseTokenAccounts?.filter((gTA) => gTA.itemType == 'ship')
      ?.find((gTA) => gTA.mint.toString() == shipMint.toString())
      ?.wrappedShipEscrows.sort((a, b) => a.amount.toNumber() - b.amount.toNumber())
      .at(0) ??
    (() => {
      throw new Error('no shipEscrow found')
    })()

  private getShipEscrowIndex = (shipMint: PublicKey) => {
    const index = usePlayerStore().starbasePlayer?.wrappedShipEscrows.findIndex(
      (wse) =>
        wse.ship.toString() === this.getShipByMint(shipMint)?.toString() &&
        wse.amount >= this.getShipEscrow(shipMint)?.amount,
    )
    if (index === -1) {
      throw new Error('no ShipEscrowIndex found')
    }
    return index
  }

  private getFleetByKey = (fleetKey: PublicKey) =>
    usePlayerStore().fleets?.find((f) => f.key.toString() == fleetKey.toString()) ??
    (() => {
      throw new Error('no fleet key found')
    })()

  private getPlanetAddressByFleetKey = (fleetKey: PublicKey) =>
    useGameStore()
      .planets?.filter((p) => p.data.numResources > 0)
      .find(
        (p) =>
          p.data.sector[0]?.eq(this.getFleetByKey(fleetKey).state.Idle?.sector[0] ?? new BN(0)) &&
          p.data.sector[1]?.eq(this.getFleetByKey(fleetKey).state.Idle?.sector[1] ?? new BN(0)),
      )?.key ??
    (() => {
      throw new Error('no planet address found')
    })()

  private getResourceByPlanetKey = (planet: PublicKey) =>
    useGameStore().resources?.find((r) => r.data.location.toString() == planet.toString()) ??
    (() => {
      throw new Error('no resource for planet found')
    })()

  private getFuelTokenAccountByFleetKey = (fleetKey: PublicKey) =>
    getAssociatedTokenAddressSync(
      new PublicKey(useTokenStore().tokenList.find((t) => t.symbol == 'FUEL')?.mint ?? ''),
      this.getFleetByKey(fleetKey)?.data?.fuelTank,
      true,
    ) ??
    (() => {
      throw new Error('no fleetFuelToken found')
    })()

  private getCargoStatsDefinition = () =>
    useGameStore().game?.data.cargo.statsDefinition ??
    (() => {
      throw new Error('no cargoStatsDefinition found')
    })()

  private getCargoTypeAddress = (mint: PublicKey) =>
    CargoType.findAddress(this.getCargoProgram(), this.getCargoStatsDefinition(), mint, 0)[0] ??
    (() => {
      throw new Error('no CargoTypeAddress found')
    })()

  private getMintBySymbol = (symbol: string) =>
    new PublicKey(useTokenStore().tokenList.find((t) => t.symbol == symbol)?.mint ?? '') ??
    (() => {
      throw new Error('no MintBySymbol found')
    })()

  private getMineItemAddress = (mint: PublicKey) =>
    MineItem.findAddress(this.getSageProgram(), this.getGameId(), mint)[0] ??
    (() => {
      throw new Error('no MintBySymbol found')
    })()

  private getResourceAddress = (mineItem: PublicKey, location: PublicKey) =>
    Resource.findAddress(this.getSageProgram(), mineItem, location)[0] ??
    (() => {
      throw new Error('no ResourceAddress found')
    })()

  private getMiningXpCategory = () =>
    useGameStore().game?.data.points.miningXpCategory?.category ??
    (() => {
      throw new Error('no miningXpCategory found')
    })()

  private getPilotXpCategory = () =>
    useGameStore().game?.data.points.pilotXpCategory?.category ??
    (() => {
      throw new Error('no pilotXpCategory found')
    })()

  private getCouncilRankXpCategory = () =>
    useGameStore().game?.data.points.councilRankXpCategory?.category ??
    (() => {
      throw new Error('no councilRankXpCategory found')
    })()

  private getUserPointsAccountAddress = (category: PublicKey) =>
    UserPoints.findAddress(this.getPointsProgram(), category, this.getPlayerProfileAddress())[0] ??
    (() => {
      throw new Error('no miningXpCategory found')
    })()

  private getPointsModifierAddress = (category: PublicKey) =>
    Game.findPointsModifierAddress(this.getSageProgram(), this.getGameId(), category)[0] ??
    (() => {
      throw new Error('no miningXpCategory found')
    })()
}

const chunkShipAmounts = (amount: number, max = 254) => {
  const chunks = [...Array(Math.floor(amount / max)).keys()].map(() => max)
  if (amount % max > 0) {
    chunks.push(amount % max)
  }
  return chunks
}
