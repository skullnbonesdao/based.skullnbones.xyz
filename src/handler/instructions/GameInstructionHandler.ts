import { AsyncSigner, createAssociatedTokenAccountIdempotent } from '@staratlas/data-source'
import { SagePlayerProfile, StarbasePlayer } from '@staratlas/sage/src'
import { BN } from '@staratlas/anchor'
import { useWorkspaceAdapter } from 'src/handler/connector'
import { findShipByMint, findStarbasePlayerAddress } from 'src/handler/interfaces/GameInterface'
import { useProfileStore } from 'stores/profileStore'
import { useGameStore } from 'stores/gameStore'
import { PublicKey } from '@solana/web3.js'
import { AddShipEscrowInput, StarbaseDepositCargoToGameInput } from '@staratlas/sage'
import { findCargoPodAddress, findCargoTypeAddress } from 'src/handler/interfaces/CargoInterface'
import { checkAccountExists } from 'src/handler/helper/checkAccountExists'

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
        ship,
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

    const cargoPod = findCargoPodAddress()

    //  const cargoPod = new PublicKey('6uJuzcGKXiFfCXPkrAx9xzgfUAn8LoAD9ieTs43Um3H9')

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
}