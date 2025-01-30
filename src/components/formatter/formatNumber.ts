export function formatNumber(number: number) {
  const tiers = [
    { suffix: 'B', divisor: 1e9 },
    { suffix: 'M', divisor: 1e6 },
    { suffix: 'k', divisor: 1e3 },
  ]

  for (const tier of tiers) {
    if (Math.abs(number) >= tier.divisor) {
      const divided = number / tier.divisor
      let formatted
      if (divided >= 10 || divided <= -10) {
        formatted = Math.round(divided).toString()
      } else {
        formatted = divided.toFixed(1).replace(/\.0$/, '')
      }
      return formatted + tier.suffix
    }
  }

  return number.toString()
}
