import {Fleet, MineItemAccount, ResourceAccount, ShipStats} from '@staratlas/sage'
import {BN} from '@staratlas/anchor'

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
  fleetFoodToken: TokenAccount /** before harvesting */,
  fleetAmmoToken: TokenAccount /** before harvesting */,
  mineItem: MineItemAccount,
  resource: ResourceAccount,
  penalty: number,
  startTime?: BN,
) => {
  if (!fleetAccount.state.MineAsteroid) {
    throw 'Fleet not mining'
  }
  const miningStart = startTime ?? fleetAccount.state.MineAsteroid.start
  const miningDuration = fleetAccount.state.MineAsteroid.lastUpdate.sub(miningStart).toNumber()
  const maxFoodDuration = Fleet.calculateAsteroidMiningFoodDuration(
    <ShipStats>fleetAccount.data.stats,
    Number(fleetFoodToken.delegatedAmount),
  )
  const maxAmmoDuration = Fleet.calculateAsteroidMiningAmmoDuration(
    <ShipStats>fleetAccount.data.stats,
    Number(fleetAmmoToken.delegatedAmount),
  )
  const foodConsumed = Fleet.calculateAsteroidMiningFoodToConsume(
    <ShipStats>fleetAccount.data.stats,
    Number(fleetFoodToken.delegatedAmount),
    Math.min(miningDuration, Math.floor(maxFoodDuration)),
  )
  const ammoConsumed = Fleet.calculateAsteroidMiningAmmoToConsume(
    <ShipStats>fleetAccount.data.stats,
    Number(fleetAmmoToken.delegatedAmount),
    Math.min(miningDuration, Math.floor(maxFoodDuration), Math.floor(maxAmmoDuration)),
  )
  const resourceExtracted = Fleet.calculateAsteroidMiningResourceToExtract(
    <ShipStats>fleetAccount.data.stats,
    mineItem,
    resource,
    Math.min(miningDuration, Math.floor(maxFoodDuration), Math.floor(maxAmmoDuration)),
    1_000_000 /** arbitrary large number */,
    penalty,
  )

  return {
    ammoConsumed,
    foodConsumed,
    maxAmmoDuration,
    maxFoodDuration,
    miningDuration,
    resourceExtracted,
  }
}
