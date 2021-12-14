import React, { FC, useMemo } from 'react'
import { Catalogue } from '../../catalogue/Catalogue'
import { CartInterface, Item } from '../Cart'
import { MoneyFormatter } from '../currency/MoneyFormatter'
import { PromotionItemInterface, getPromotionItems } from '../promotion/PromotionItem'
import { PromotionItemsView } from '../promotion/PromotionItemsView'
import { TaxItemInterface, getTaxItems } from '../tax/TaxItem'
import { TaxItemsView } from '../tax/TaxItemsView'
import { isSaleItem } from './ProductLineItem'

type Props = {
  items: Item[]
  cart: CartInterface
  format: MoneyFormatter
  catalogue: Catalogue
}

export const ItemsView: FC<Props> = ({items, format, cart, catalogue}) => {
  if (items.length == 0) {
    return null
  }

  const saleItems = useMemo(() => items.filter(isSaleItem), [items])

  return (
    <table className="table table-striped table-sm monetary">
      <thead>
        <tr>
          <th className="text-end">#</th>
          <th>Name</th>
          <th className="text-end">Each</th>
          <th className="text-end">Quantity</th>
          <th className="text-end">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {saleItems.map((item) => {
          const taxItems: TaxItemInterface[] = getTaxItems(item.id, items)
          const promotionItems: PromotionItemInterface[] = getPromotionItems(item.id, items)
          const product = catalogue.products.find(p => p.id === item.productId)
          return (
            <React.Fragment key={item.id}>
              <tr>
                <td className="text-end">{item.id}</td>
                <td>{product?.name || item.productId}</td>
                <td className="text-end">{format(item.amount)}</td>
                <td className="text-end">{item.quantity}</td>
                <td className="text-end">{format(item.total(cart))}</td>
              </tr>
              <TaxItemsView
                taxItems={taxItems}
                otherItems={items}
                format={format}
                cart={cart}
              />
              <PromotionItemsView
                cart={cart}
                promotionItems={promotionItems}
                otherItems={items}
                format={format}
              />
            </React.Fragment>
          )
        })}
      </tbody>
      <tfoot>
        <tr>
          <td/>
          <th colSpan={3} className="text-end">Items total</th>
          <th className="text-end">{format(cart.total())}</th>
        </tr>
      </tfoot>
    </table>
  )
}
