import Big from 'big.js'
import { fold } from 'fp-ts/Either'
import { CartInterface, Item } from '../Cart'
import { SaleItemInterface } from '../productLineItem/ProductLineItem'
import { zero } from '../util/sum'

export const isTaxItem = (obj: unknown): obj is TaxItemInterface => obj instanceof TaxItem || obj instanceof TaxItem

export interface TaxItemInterface extends Item {
  id: number
  saleItemId: number
  description: string
  rate: Big
}

export class TaxItem implements TaxItemInterface {
  id: number
  saleItemId: number
  description: string
  rate: Big
  constructor(
    id: number,
    saleItemId: number,
    rate: Big, description: string
  ) {
    this.id = id
    this.saleItemId = saleItemId
    this.rate = rate
    this.description = description
  }

  public total(cart: CartInterface): Big {
    return fold(
      () => zero,
      (saleItem: SaleItemInterface) => saleItem.total(cart).mul(this.rate)
    )(cart.findSaleItem(this.saleItemId))
  }
}

export function getTaxItems(taxedItemId: number, items: Item[]): TaxItemInterface[] {
  return items.filter(i => isTaxItem(i) && i.saleItemId === taxedItemId) as TaxItemInterface[]
}
