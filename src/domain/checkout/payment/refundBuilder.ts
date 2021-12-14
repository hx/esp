import { EventBase } from '../../../esp'
import { Applicator } from '../../../esp/Applicator'
import { Store } from '../../Store'
import { Refund } from './Refund'
import Big from 'big.js'
import { Cart } from '../Cart'

type RefundEvent = EventBase<'issueRefund', {
  amount: number
  itemIDs: string
}>

export const buildRefund: Applicator<Store> = (store, add) => {
  const cart = store.cart
  const eventClass = add<RefundEvent>('issueRefund', 'Refund')
    .handle(({event: {args: {amount, itemIDs}}, reject}) => {
      if (!/^(\s*\d+(\s*,\s*\d+)*\s*)?$/.test(itemIDs)) {
        return reject('Item IDs should be comma-separated integers')
      }
      const ids = itemIDs === '' ? [] : itemIDs.trim().split(/\s*,\s*/).map(Number)
      const refund: Refund = {id: 0, amount: new Big(amount), saleItemIDs: ids}
      try {
        cart.applyRefund(cart.taxableItems(), refund)
      } catch(e) {
        return reject(String(e))
      }
      return {
        ...store,
        cart: new Cart(
          cart.currencyCode,
          [...cart.lines, refund],
          cart.taxCalculations,
          cart.paid
        )
      }
    })
  eventClass.addArgument('amount', 'Amount', cart.totalPayments().toNumber())
  eventClass.addArgument('itemIDs', 'Sale Items')
}
