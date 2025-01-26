export function formatTimeSpan(timestamp: number) {
  let seconds = Math.floor(timestamp / 1000)
  const intervals = [
    { unit: 'D', factor: 86400 }, // 60 * 60 * 24
    { unit: 'H', factor: 3600 }, // 60 * 60
    { unit: 'Min', factor: 60 },
    { unit: 'Sec', factor: 1 },
  ]

  return intervals
    .reduce((acc, { unit, factor }) => {
      const value = Math.floor(seconds / factor)
      if (value > 0) {
        acc.push(`${value}${unit}`)
        seconds -= value * factor
      }
      return acc
    }, [])
    .join(' ')
}
