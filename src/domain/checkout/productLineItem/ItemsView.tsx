import Big from 'big.js'
import React, { FC, useMemo } from 'react'
import { MoneyFormatter } from '../currency/MoneyFormatter'
import { Item } from '../Cart'
import {PromotionItemInterface, getPromotionItems} from '../promotion/PromotionItem'
import {TaxItemInterface, getTaxItems} from '../tax/TaxItem'
import {TaxItemsView} from '../tax/TaxItemsView'
import {PromotionItemsView} from '../promotion/PromotionItemsView'
import {isSaleItem} from './ProductLineItem'

export const ItemsView: FC<{ items: Item[], total: Big, format: MoneyFormatter }> = ({items, format, total}) => {
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
          return (
            <React.Fragment key={item.id}>
              <tr>
                <td className="text-end">{item.id}</td>
                <td>{item.name}</td>
                <td className="text-end">{format(item.amount)}</td>
                <td className="text-end">{item.quantity}</td>
                <td className="text-end">{format(item.total())}</td>
              </tr>
              <TaxItemsView
                taxItems={taxItems}
                otherItems={items}
                format={format}
              />
              <PromotionItemsView
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
          <th className="text-end">{format(total)}</th>
        </tr>
      </tfoot>
    </table>
  )
}
