import { Big } from 'big.js'
import { EventBase } from '../../../esp'
import { EventClassCreator } from '../../../esp/EventClassCreator'
import { Store } from '../../Store'
import { Cart } from '../Cart'
import { TaxItem } from './TaxItem'

type TaxEvent = EventBase<'tax', {
  itemID: number
  rate: number
  isFraction: boolean
}>

export const buildTaxLineItems = (store: Store, add: EventClassCreator<Store>) => {
  if (store.cart.saleItems().length > 0) addTax(store, add)
}

function addTax(store: Store, add: EventClassCreator<Store>) {
  const cart = store.cart
  const event = add<TaxEvent>('tax', 'Tax')
    .handle(({event: {args: {rate}}}) => {
      const taxItems = cart.saleItems().map(saleItem =>
        new TaxItem(
          cart.nextItemId(),
          saleItem.id,
          Big(rate).div(100),
          `${rate}% Tax`,
        )
      )
      return {
        ...store,
        cart: new Cart(cart.currencyCode, [
          ...cart.lines,
          ...taxItems
        ])
      }
    })
  event.addArgument('rate', 'Rate %', 10)
}
