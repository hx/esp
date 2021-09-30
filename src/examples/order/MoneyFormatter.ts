import Big from 'big.js'

export type MoneyFormatter = (num: Big) => string

export const makeFormatter = (currency: string): MoneyFormatter => {
  const f = new Intl.NumberFormat('en-AU', {style: 'currency', currency})
  return num => f.format(num.toNumber())
}
