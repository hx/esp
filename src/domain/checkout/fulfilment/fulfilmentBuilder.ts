import Big from 'big.js'
import { EventBase } from '../../../esp'
import { EventClassCreator } from '../../../esp/EventClassCreator'
import { Store } from '../../Store'
import { Cart } from '../Cart'
import { SHIPPING_METHODS, Shipping } from './Shipping'

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
  const saleItems = cart.saleItems()
  const unShippedItems = saleItems.filter(i => !cart.shipments().flatMap(s => s.itemIds).includes(i.id))
  const event = add<FulfilmentEvent>('Fulfilment', 'Ship')
    .handle(({event: {args: {itemIDs, address, amount, method}}, reject}) => {
      if (!/^\s*\d+(\s*,\s*\d+)*\s*$/.test(itemIDs)) {
        return reject('Item IDs should be comma-separated integers')
      }
      const ids = itemIDs.trim().split(/\s*,\s*/).map(Number)
      const saleItemIds = saleItems.map(s => s.id)
      const unShippedItemIds = unShippedItems.map(s => s.id)
      const validatedIds: number[] = []
      const duplicatedIds: number[] = []
      ids.forEach((id) => {
        if (!saleItemIds.includes(id)) {
          return reject(`Item ${id} does not exist`)
        }
        if (!unShippedItemIds.includes(id)) {
          return reject(`Item ${id} is already assigned to shipment ` + cart.shipments().find(s => s.itemIds.includes(id))!.id)
        }
        if (validatedIds.includes(id) && !duplicatedIds.includes(id)) {
          duplicatedIds.push(id)
          return reject(`Item ${id} cannot be shipped more than once `)
        }
        validatedIds.push(id)
      })
      return {
        ...store,
        cart: new Cart(cart.currencyCode, [
          ...cart.lines,
          new Shipping(
            cart.nextItemId(),
            method,
            address,
            ids,
            new Big(amount)
          )
        ], cart.taxCalculations)
      }
    })
  event.addArgument('method', 'Method').options(
    Object.entries(SHIPPING_METHODS).map(([id, name ]) => ({displayName: name, value: id}))
  )
  event.addArgument('address', 'Address', '12 Pitt St, Sydney 2001')
  event.addArgument('itemIDs', 'Item IDs', unShippedItems.map(i => i.id).join(', '))
  event.addArgument('amount', 'Cost', 10.00)
}
