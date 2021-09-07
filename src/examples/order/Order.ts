import Big from 'big.js'
import { isObj } from '../../utilities'

export interface PaymentMethod {
  providerId: string
  methodId: string
}

export const isPaymentMethod = (obj: unknown): obj is PaymentMethod =>
  isObj(obj) &&
  typeof obj.providerId === 'string' &&
  typeof obj.methodId === 'string'

export type Currency = 'AUD' | 'USD' | 'NZD' | 'GBP'

export const currencyNames: Record<Currency, string> = {
  AUD: 'Dollarbucks',
  USD: 'Greeeeeeen',
  NZD: 'Kiwi cash',
  GBP: 'Pommie pounds'
}

export interface Line {
  id: number
}

export interface Payment extends Line {
  method: PaymentMethod
  amount: Big
}

export interface Item extends Line {
  name: string
  unitPriceExTax: Big
  quantity: number
}

export const isPayment = (obj: unknown): obj is Payment =>
  isObj(obj) &&
  obj.amount instanceof Big &&
  isPaymentMethod(obj.method)

export const isItem = (obj: unknown): obj is Item =>
  isObj(obj) &&
  typeof obj.name === 'string' &&
  obj.unitPriceExTax instanceof Big &&
  typeof obj.quantity === 'number'

export interface Order {
  currencyCode: Currency
  lines: Line[]
}
