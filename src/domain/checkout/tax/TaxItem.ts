import Big from 'big.js'
import {Item} from '../Cart'
import {sum} from '../util/sum'

export const isTaxItem = (obj: unknown): obj is TaxItemInterface => obj instanceof TaxItem || obj instanceof TaxItem


export interface TaxItemInterface extends Item {
  id: number
  saleItemId: number
  description: string
  rate: Big
  amount: Big
}

export class TaxItem implements TaxItemInterface {
  id: number
  saleItemId: number
  description: string
  rate: Big
  amount: Big
  constructor(
    id: number,
    saleItemId: number,
    rate: Big, description: string, amount: Big
  ) {
    this.id = id
    this.saleItemId = saleItemId
    this.rate = rate
    this.description = description
    this.amount = amount
  }

  public total(): Big {
    return this.amount
  }
}

export function getTaxItems(taxedItemId: number, items: Item[]): TaxItemInterface[] {
  return items.filter(i => isTaxItem(i) && i.saleItemId === taxedItemId) as TaxItemInterface[]
}
