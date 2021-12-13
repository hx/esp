import { Big } from 'big.js'
import { EventBase } from '../../../esp'
import { EventClassCreator } from '../../../esp/EventClassCreator'
import { Cart, CartInterface } from '../Cart'
import { TaxItem } from './TaxItem'
import { Store } from '../../Store'

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
  const singleItemTaxEvent = add<TaxEvent>('tax', 'Tax')
    .handle(({event: {args: {rate}}}) => {
      const taxItems = cart.saleItems().map(saleItem =>
        new TaxItem(
          cart.nextItemId(),
          saleItem.id,
          Big(rate),
          `${rate}% Tax`,
          Big(rate).div(100).mul(saleItem.total()),
        )
      )
      return new Store(
        new Cart(cart.currencyCode, [
          ...cart.lines,
          ...taxItems
        ])
      )
    })
  singleItemTaxEvent.addArgument('rate', 'Rate', 10)
}
