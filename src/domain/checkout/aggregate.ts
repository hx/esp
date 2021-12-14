import { buildCurrency } from './currency/currencyBuilder'
import { buildPayment } from './payment/paymentBuilder'
import { buildProductLineItems } from './productLineItem/productBuilder'
import { buildPromotionLineItems } from './promotion/promoBuilder'
import { buildTaxLineItems } from './tax/taxBuilder'
import { buildFulfilmentLineItems } from './fulfilment/fulfilmentBuilder'
import { EventClassCreator } from '../../esp/EventClassCreator'
import { Store } from '../Store'
import { Applicator } from '../../esp/Applicator'

export const createStoreAggregate: Applicator<Store> = (store, add, events) => {
  buildProductLineItems(store, add)
  buildPromotionLineItems(store, add)
  buildTaxLineItems(store, add, events)
  buildCurrency(store, add)
  buildFulfilmentLineItems(store, add)
  buildPayment(store, add)
}
