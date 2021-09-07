import Big from 'big.js'
import { Item, Line, Order, Payment, isItem, isPayment, isSaleItem, isTaxItem } from './Order'

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
export const orderSaleItems     = (order: Order) => order.lines.filter(isSaleItem)
export const orderTaxItems      = (order: Order) => order.lines.filter(isTaxItem)
export const orderPayments      = (order: Order) => order.lines.filter(isPayment)
export const orderItemsTotal    = (items: Item[], dependentItems: Item[] = items) => sum(items, i => orderItemSubtotal(i, dependentItems))
export const orderPaymentsTotal = (payments: Payment[]) => sum(payments, p => p.amount)
export const orderItemSubtotal  = (item: Item, otherItems: Item[]): Big => {
  if (isSaleItem(item)) {
    return item.amount.times(item.quantity)
  }
  if (isTaxItem(item)) {
    if (!item.isFraction) {
      return item.amount
    }
    const saleItem = otherItems.find(i => i.id === item.saleItemID)
    if (!saleItem) {
      throw new Error('sale item missing when calculating fractional tax')
    }
    return item.amount.times(orderItemSubtotal(saleItem, otherItems))
  }
  return item.amount
}

export const orderBalance = (order: Order) =>
  orderItemsTotal(orderItems(order))
    .sub(orderPaymentsTotal(orderPayments(order)))

export const nextID = <T extends Line>(lines: T[]) => lines[0] ? lines[lines.length - 1].id + 1 : 1
