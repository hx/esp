import { ItemID } from '../types'
import { Item, isItem } from '../Cart'
import Big from 'big.js'
import { isObj } from '../../../utilities'
import { SaleItemInterface } from '../productLineItem/ProductLineItem'

export const SHIPPING_METHODS: Record<string, string> = {
  'ozpost': 'Australia Post',
  'dhl': 'DHL' ,
  'fedex': 'Fedex',
}

export type ShippingMethod = string

export interface FulfilmentInterface extends Item {
    itemIds: ItemID[]
    amount: Big
}

export class Shipping implements FulfilmentInterface {
    id: ItemID
    method: ShippingMethod
    address: string
    itemIds: ItemID[]
    amount: Big;

    constructor(id: ItemID, method: ShippingMethod, address: string, items: ItemID[], amount: Big) {
      this.id = id
      this.method = method
      this.address = address
      this.itemIds = items
      this.amount = amount
    }

    total(): Big {
      return this.amount
    }
}

export const isShipping = (obj: unknown): obj is Shipping => obj instanceof Shipping
