import { Big } from 'big.js'
import { EventBase } from '../../../esp'
import { EventClassCreator } from '../../../esp/EventClassCreator'
import { Store } from '../../Store'
import { Cart } from '../Cart'
import { Applicator } from '../../../esp/Applicator'
import { TaxCalculation } from '../TaxCalculation'

type TaxEvent = EventBase<'tax', {
  itemID: number
  rate: number
  isFraction: boolean
}>

export const buildTaxLineItems: Applicator<Store> = (store, add, events) => {
  if (store.cart.saleItems().length > 0) addTax(store, add, events)
}

function addTax(store: Store, add: EventClassCreator<Store>, events: EventBase[]) {
  const cart = store.cart
  const event = add<TaxEvent>('tax', 'Tax')
    .handle(({event: {args: {rate}}}) => {
      // Simulate a tax calculation service lookup by applying a flat rate to every item.
      const calc: TaxCalculation = {
        productLines: cart.saleItems().map(saleItem => ({
          productId: saleItem.productId,
          unitPrice: saleItem.amount,
          quantity:  saleItem.quantity,
          taxRate:   new Big(rate).div(100)
        })),
        shipmentLines: cart.shipments().map(shipment => ({
          itemIds: shipment.itemIds,
          amount: shipment.amount,
          method:  shipment.method,
          address:  shipment.address,
          taxRate:   new Big(rate).div(100)
        })),
      }
      return {
        ...store,
        cart: new Cart(
          cart.currencyCode,
          cart.lines,
          [calc, ...cart.taxCalculations],
          cart.paid
        )
      }
    })
  event.addArgument('rate', 'Rate %', 10)
}
