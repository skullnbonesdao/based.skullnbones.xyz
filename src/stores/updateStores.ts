import { useGameStore } from 'stores/game-store'
import { usePlayerProfileStore } from 'stores/player-profile-store'
import { getSigner } from 'components/squads/SignerFinder'
import { useFactionStore } from 'stores/faction-store'
import { usePointsStore } from 'stores/points-store'

export async function updateStores() {
  usePlayerProfileStore().wallet = getSigner()
  await usePlayerProfileStore().updateStore()
  await useGameStore().updateStore()
  await useFactionStore().updateStore()
  await usePointsStore().updateStore()

  return
}
