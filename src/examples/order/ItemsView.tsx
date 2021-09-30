import React, { FC, useMemo } from 'react'
import { MoneyFormatter } from './MoneyFormatter'
import { Item, isSaleItem, isTaxItem } from './Order'
import { orderItemSubtotal, orderItemsTotal } from './orderDerivation'

export const ItemsView: FC<{ items: Item[], format: MoneyFormatter }> = ({items, format}) => {
  if (!items[0]) {
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
          const taxItems = items.filter(i => isTaxItem(i) && i.saleItemID === item.id)

          return (
            <React.Fragment key={item.id}>
              <tr>
                <td className="text-end">{item.id}</td>
                <td>{item.name}</td>
                <td className="text-end">{format(item.amount)}</td>
                <td className="text-end">{item.quantity}</td>
                <td className="text-end">{format(orderItemSubtotal(item, items))}</td>
              </tr>
              {taxItems.map(taxItem => (
                <tr className="small" key={taxItem.id}>
                  <td className="text-end">{taxItem.id}</td>
                  <td className="text-end text-muted" colSpan={3}>Tax</td>
                  <td className="text-end">{format(orderItemSubtotal(taxItem, items))}</td>
                </tr>
              ))}
            </React.Fragment>
          )
        })}
      </tbody>
      <tfoot>
        <tr>
          <td/>
          <th colSpan={3} className="text-end">Items total</th>
          <th className="text-end">{format(orderItemsTotal(items))}</th>
        </tr>
      </tfoot>
    </table>
  )
}
