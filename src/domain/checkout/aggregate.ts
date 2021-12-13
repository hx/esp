import { createAggregate } from '../../esp'
import { buildCurrency } from './currency/currencyBuilder'
import { CartInterface } from './Cart'
import { buildPayment } from './payment/paymentBuilder'
import { buildProductLineItems } from './productLineItem/productBuilder'
import {buildPromotionLineItems} from './promotion/promoBuilder'
import {buildTaxLineItems} from './tax/taxBuilder'
import { buildFulfilmentLineItems } from './fulfilment/fulfilmentBuilder'

export const createCartAggregate = (cart: CartInterface) => createAggregate(
  cart,
  (cart, add) => {
    buildProductLineItems(cart, add)
    buildPromotionLineItems(cart, add)
    buildTaxLineItems(cart, add)
    buildCurrency(cart, add)
    buildFulfilmentLineItems(cart, add)
    buildPayment(cart, add)
  }
)
