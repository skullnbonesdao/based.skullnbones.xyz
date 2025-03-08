import {Fleet, MineItemAccount, ResourceAccount, ShipStats} from '@staratlas/sage'
import {BN} from '@staratlas/anchor'
import {Account} from '@solana/web3.js'

/**
 * Calculate mining results i.e. duration and amount of resource extracted
 * @param fleetAccount - the fleet account loaded after harvesting
 * @param fleetFoodToken - fleet food token account loaded before harvesting
 * @param fleetAmmoToken - fleet ammo token account loaded before harvesting
 * @param mineItem - the mine item account in question
 * @param resource - the resource account in question
 * @param penalty - the mining rate penalty
 * @param startTime - the mining start time if known (time since last harvest)
 * @returns mining results
 */
export const calculateMiningResults = (
  fleetAccount: Fleet /** after harvesting */,
  fleetFoodToken: Account /** before harvesting */,
  fleetAmmoToken: Account /** before harvesting */,
  mineItem: MineItemAccount,
  resource: ResourceAccount,
  penalty: number,
) => {
  if (!fleetAccount.state.MineAsteroid) {
    throw 'Fleet not mining'
  }
  const timestampNow = new BN(Date.now() / 1000)
  const miningDuration = timestampNow.sub(fleetAccount.state.MineAsteroid.lastUpdate).toNumber()

  const fuelDurationMax = 0

  const foodDurationMax = Fleet.calculateAsteroidMiningFoodDuration(
    <ShipStats>fleetAccount.data.stats,
    Number(fleetFoodToken.delegatedAmount),
  )
  const ammoDurationMax = Fleet.calculateAsteroidMiningAmmoDuration(
    <ShipStats>fleetAccount.data.stats,
    Number(fleetAmmoToken.delegatedAmount),
  )

  const fuelConsumed = 0

  const foodConsumed = Fleet.calculateAsteroidMiningFoodToConsume(
    <ShipStats>fleetAccount.data.stats,
    Number(fleetFoodToken.delegatedAmount),
    Math.min(miningDuration, Math.floor(foodDurationMax)),
  )
  const ammoConsumed = Fleet.calculateAsteroidMiningAmmoToConsume(
    <ShipStats>fleetAccount.data.stats,
    Number(fleetAmmoToken.delegatedAmount),
    Math.min(miningDuration, Math.floor(foodDurationMax), Math.floor(ammoDurationMax)),
  )
  const resourceExtracted = Fleet.calculateAsteroidMiningResourceToExtract(
    <ShipStats>fleetAccount.data.stats,
    mineItem,
    resource,
    Math.min(miningDuration, Math.floor(foodDurationMax), Math.floor(ammoDurationMax)),
    1_000_000_000 /** arbitrary large number */,
    penalty,
  )

  const timeRemaining =
    Math.min(Math.floor(foodDurationMax), Math.floor(ammoDurationMax)) - miningDuration

  return {
    fuelConsumed,
    ammoConsumed,
    foodConsumed,

    fuelDurationMax,
    ammoDurationMax,
    foodDurationMax,

    miningDuration,
    resourceExtracted,

    timeRemaining,
  }
}
