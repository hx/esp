import Big from 'big.js'
import { Item, Line, Order, Payment, isItem, isPayment, isSaleItem, isTaxItem } from './Order'
import { sum } from './sum'

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
