import Big from 'big.js'
import {isObj} from '../../../utilities'
import { Item, isItem } from '../Cart'

export interface SaleItemInterface extends Item {
  amount: Big
  productId: string
  quantity: number
}
export class SaleItem implements SaleItemInterface {
  amount: Big
  id: number
  productId: string
  quantity: number

  constructor(
    id: number,
    productId: string,
    quantity: number,
    amount: Big,
  ) {
    this.id = id
    this.productId = productId
    this.quantity = quantity
    this.amount = amount
  }

  public total(): Big {
    return this.amount.times(this.quantity)
  }
}

export const isSaleItem = (obj: unknown): obj is SaleItemInterface =>
  isObj(obj) && isItem(obj) &&
  typeof obj.productId === 'string' &&
  typeof obj.quantity === 'number'
