import { PointsCategoryEnum } from 'src/handler/interfaces/PointsInterface'
import { Faction } from '@staratlas/profile-faction'

export function getPointsCategoryEnumString(value: PointsCategoryEnum): string {
  return PointsCategoryEnum[value]
}

export function getFactionEnumString(value: Faction): string {
  return Faction[value]
}
