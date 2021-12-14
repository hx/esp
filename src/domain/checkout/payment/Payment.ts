import Big from 'big.js'
import {isObj} from '../../../utilities'
import {Line} from '../Cart'
import { Refund } from './Refund'

export interface PaymentMethod {
  providerId: string
  methodId: string
}

export interface Payment extends Line {
  method: PaymentMethod
  amount: Big
}
export const PAYMENT_METHODS: Record<string, string> = {
  'PayPal':      'paypal.hosted',
  'Credit card': 'braintree.card',
  'Cash':        'bigcommerce.cash'
}

export const isPaymentMethod = (obj: unknown): obj is PaymentMethod =>
  isObj(obj) &&
  typeof obj.providerId === 'string' &&
  typeof obj.methodId === 'string'

export const isPayment = (obj: unknown): obj is Payment =>
  isObj(obj) &&
  obj.amount instanceof Big &&
  isPaymentMethod(obj.method)

export const isRefund = (obj: unknown): obj is Refund =>
  isObj(obj) &&
  obj.amount instanceof Big &&
  Array.isArray(obj.saleItemIDs) &&
  obj.saleItemIDs.every(i => typeof i === 'number')
