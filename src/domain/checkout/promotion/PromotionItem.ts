import Big from 'big.js'
import {Item} from '../Cart'
import {SaleItemInterface} from '../productLineItem/ProductLineItem'
import {sum} from '../util/sum'

export const isPromotionItem = (obj: unknown): obj is PromotionItemInterface => obj instanceof PromotionItem

export interface PromotionItemInterface extends Item {
  id: number
  saleItemId: number
  description: string
  amount: Big
}

export class PromotionItem implements PromotionItemInterface {
  id: number
  saleItemId: number
  description: string
  amount: Big

  constructor(
    id: number,
    saleItemId: number,
    description: string,
    amount: Big
  ) {
    this.id = id
    this.saleItemId = saleItemId
    this.description = description
    this.amount = amount
  }

  public total(): Big {
    return this.amount
  }
}

export function getPromotionItems(discountedItemId: number, items: Item[]): PromotionItemInterface[] {
  return items.filter(i => isPromotionItem(i) && i.saleItemId === discountedItemId) as PromotionItemInterface[]
}
