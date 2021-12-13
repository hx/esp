import { buildCurrency } from './currency/currencyBuilder'
import { buildPayment } from './payment/paymentBuilder'
import { buildProductLineItems } from './productLineItem/productBuilder'
import { buildPromotionLineItems } from './promotion/promoBuilder'
import { buildTaxLineItems } from './tax/taxBuilder'
import { buildFulfilmentLineItems } from './fulfilment/fulfilmentBuilder'
import { EventClassCreator } from '../../esp/EventClassCreator'
import { Store } from '../Store'

export const createCartAggregate = (store: Store, add: EventClassCreator<Store>) => {
  buildProductLineItems(store, add)
  buildPromotionLineItems(store, add)
  buildTaxLineItems(store, add)
  buildCurrency(store, add)
  buildFulfilmentLineItems(store, add)
  buildPayment(store, add)
}
