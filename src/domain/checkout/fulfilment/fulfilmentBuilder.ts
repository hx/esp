import { EventBase } from '../../../esp'
import { Cart, CartInterface } from '../Cart'
import { SHIPPING_METHODS, Shipping } from './Shipping'
import { EventClassCreator } from '../../../esp/EventClassCreator'
import Big from 'big.js'

type FulfilmentEvent = EventBase<'Fulfilment', {
    itemIDs: string,
    address: string
    amount: number,
    method: string
}>

export const buildFulfilmentLineItems = (cart: CartInterface, add: EventClassCreator<CartInterface>) => {
  if (cart.saleItems().length > 0) addFulfilment(cart as Cart, add)
}

function addFulfilment(cart: Cart, add: EventClassCreator<CartInterface>) {
  const event = add<FulfilmentEvent>('Fulfilment', 'Fulfilment')
    .handle(({event: {args: {itemIDs, address, amount, method}}, reject}) => {
      if (!/^\s*\d+(\s*,\s*\d+)*\s*$/.test(itemIDs)) {
        return reject('Item IDs should be comma-separated integers')
      }
      const ids = itemIDs.trim().split(/\s*,\s*/).map(Number)
      return new Cart(cart.currencyCode, [
        ...cart.lines,
        new Shipping(
          cart.nextItemId(),
          method,
          address,
          ids,
          new Big(amount)
        )
      ])
    })
  event.addArgument('method', 'Method').options(
    Object.entries(SHIPPING_METHODS).map(([id, name ]) => ({displayName: name, value: id}))
  )
  event.addArgument('address', 'Address', '12 Pitt St, Sydney 2001')
  event.addArgument('itemIDs', 'Item IDs', cart.saleItems().map(i => i.id).join(', '))
  event.addArgument('amount', 'Cost', 10.00)
}
