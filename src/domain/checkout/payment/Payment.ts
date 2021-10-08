import Big from 'big.js'
import {isObj} from '../../../utilities'
import {Line} from '../Cart'

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

