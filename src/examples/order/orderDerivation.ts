import Big from 'big.js'
import { Item, Order, Payment, isItem, isPayment } from './Order'

interface Sum {
  (nums: Big[]): Big
  (...nums: Big[]): Big
  <T>(nums: T[], mapper: (num: T) => Big): Big
}

const isBig = (obj: unknown): obj is Big => obj instanceof Big
const zero = new Big(0)

const sum: Sum = <T>(...args: unknown[]) => {
  if (args.every(isBig)) {
    return sum(args)
  }

  if (args.length === 2) {
    const [nums, mapper] = args as [T[], (num: T) => Big]
    if (Array.isArray(nums) && typeof mapper === 'function') {
      return sum(nums.map(mapper))
    }
  }

  const nums = args[0] as Big[]
  return nums.length === 0 ? zero : nums.reduce((a, b) => a.plus(b))
}

export const orderItems         = (order: Order) => order.lines.filter(isItem)
export const orderPayments      = (order: Order) => order.lines.filter(isPayment)
export const orderItemSubtotal  = (item: Item) => item.unitPriceExTax.times(item.quantity)
export const orderItemsTotal    = (items: Item[]) => sum(items, orderItemSubtotal)
export const orderPaymentsTotal = (payments: Payment[]) => sum(payments, p => p.amount)

export const orderBalance = (order: Order) =>
  orderItemsTotal(orderItems(order))
    .sub(orderPaymentsTotal(orderPayments(order)))
