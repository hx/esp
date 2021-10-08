import {Big} from 'big.js'
import {EventBase} from '../../../esp'
import {EventClassCreator} from '../../../esp/EventClassCreator'
import {Cart, CartInterface} from '../Cart'
import {makeFormatter} from '../currency/MoneyFormatter'
import {TaxItem} from './TaxItem'

type TaxEvent = EventBase<'tax', {
  itemID: number
  rate: number
  isFraction: boolean
}>

export const buildTaxLineItems = (cart: CartInterface, add: EventClassCreator<CartInterface>) => {
  if (cart.saleItems().length > 0) addTax(cart as Cart, add)
}

function addTax(cart: Cart, add: EventClassCreator<CartInterface>) {
  const format = makeFormatter(cart.currencyCode)
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
      return new Cart(cart.currencyCode, [
        ...cart.lines,
        ...taxItems
      ])
    })
  singleItemTaxEvent.addArgument('rate', 'Rate', 10)
}
