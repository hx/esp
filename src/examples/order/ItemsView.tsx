import React, { FC, useMemo } from 'react'
import { MoneyFormatter } from './MoneyFormatter'
import { Item, Order, isSaleItem } from './Order'
import { orderItemsTotal } from './orderDerivation'
import { SaleItemView } from './SaleItemView'
import { ApplyEvent } from '../../components'

interface Props {
  items: Item[]
  format: MoneyFormatter
  applyEvent: ApplyEvent<Order>
}

export const ItemsView: FC<Props> = ({items, format, applyEvent}) => {
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
        {saleItems.map((item) => <SaleItemView key={item.id} item={item} items={items} format={format} applyEvent={applyEvent}/>)}
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
