import { EventBase } from '../../../esp'
import { Cart, CartInterface } from '../Cart'
import { SHIPPING_METHODS, Shipping } from './Shipping'
import { EventClassCreator } from '../../../esp/EventClassCreator'
import Big from 'big.js'
import { Store } from '../../Store'

type FulfilmentEvent = EventBase<'Fulfilment', {
    itemIDs: string,
    address: string
    amount: number,
    method: string
}>

export const buildFulfilmentLineItems = (store: Store, add: EventClassCreator<Store>) => {
  if (store.cart.saleItems().length > 0) addFulfilment(store, add)
}

function addFulfilment(store: Store, add: EventClassCreator<Store>) {
  const cart = store.cart
  const event = add<FulfilmentEvent>('Fulfilment', 'Ship')
    .handle(({event: {args: {itemIDs, address, amount, method}}, reject}) => {
      if (!/^\s*\d+(\s*,\s*\d+)*\s*$/.test(itemIDs)) {
        return reject('Item IDs should be comma-separated integers')
      }
      const ids = itemIDs.trim().split(/\s*,\s*/).map(Number)
      return new Store(
        new Cart(cart.currencyCode, [
          ...cart.lines,
          new Shipping(
            cart.nextItemId(),
            method,
            address,
            ids,
            new Big(amount)
          )
        ])
      )
    })
  event.addArgument('method', 'Method').options(
    Object.entries(SHIPPING_METHODS).map(([id, name ]) => ({displayName: name, value: id}))
  )
  event.addArgument('address', 'Address', '12 Pitt St, Sydney 2001')
  event.addArgument('itemIDs', 'Item IDs', cart.saleItems().map(i => i.id).join(', '))
  event.addArgument('amount', 'Cost', 10.00)
}
