export function padNumber(number: number, decimals = 2, padStart = 3) {
  if (!number) number = 0.0

  const array = number.toFixed(decimals).split('.')
  array[0] = array[0].padStart(padStart, '0')
  const string = array.join('.')
  return string
}
