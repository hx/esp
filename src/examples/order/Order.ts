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
  amount: Big
}

export const isPayment = (obj: unknown): obj is Payment =>
  isObj(obj) &&
  obj.amount instanceof Big &&
  isPaymentMethod(obj.method)

export const isItem = (obj: unknown): obj is Item => !isPayment(obj)

export interface SaleItem extends Item {
  name: string
  quantity: number
}

export const isSaleItem = (obj: unknown): obj is SaleItem =>
  isObj(obj) && isItem(obj) &&
  typeof obj.name === 'string' &&
  typeof obj.quantity === 'number'

export interface TaxItem extends Item {
  saleItemID: number
  isFraction: boolean
}

export const isTaxItem = (obj: unknown): obj is TaxItem =>
  isObj(obj) && isItem(obj) &&
  typeof obj.saleItemID === 'number' &&
  typeof obj.isFraction === 'boolean'

export interface Order {
  currencyCode: Currency
  lines: Line[]
}
