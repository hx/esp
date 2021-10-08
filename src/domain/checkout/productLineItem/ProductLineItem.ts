import Big from 'big.js'
import {isObj} from '../../../utilities'
import {Item, isItem} from '../Cart'

export interface SaleItemInterface extends Item {
  amount: Big
  name: string
  quantity: number
  total(): Big
}
export class SaleItem implements SaleItemInterface {
  amount: Big
  id: number
  name: string
  quantity: number

  constructor(
    id: number,
    name: string,
    quantity: number,
    amount: Big,
  ) {
    this.id = id
    this.name = name
    this.quantity = quantity
    this.amount = amount
  }

  public total(): Big {
    return this.amount.times(this.quantity)
  }
}

export const isSaleItem = (obj: unknown): obj is SaleItemInterface =>
  isObj(obj) && isItem(obj) &&
  typeof obj.name === 'string' &&
  typeof obj.quantity === 'number'
