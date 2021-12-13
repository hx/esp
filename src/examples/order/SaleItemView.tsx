import { Item, Order, SaleItem, isTaxItem } from './Order'
import React, { FC, useCallback } from 'react'
import { orderItemSubtotal } from './orderDerivation'
import { MoneyFormatter } from './MoneyFormatter'
import { ApplyEvent } from '../../components'

interface Props {
  item: SaleItem
  items: Item[]
  format: MoneyFormatter
  applyEvent: ApplyEvent<Order>
}

export const SaleItemView: FC<Props> = ({item, items, format, applyEvent}) => {
  const taxItems = items.filter(i => isTaxItem(i) && i.saleItemID === item.id)

  const up = useCallback(e => {
    e.preventDefault()
    applyEvent({
      name:        'changeQuantity',
      description: `Increase item ${item.id} quantity by 1`,
      args:        {
        itemID:   item.id,
        quantity: item.quantity + 1
      }
    })
  }, [item, applyEvent])

  const down = useCallback(e => {
    e.preventDefault()
    applyEvent({
      name:        'changeQuantity',
      description: `Decrease item ${item.id} quantity by 1`,
      args:        {
        itemID:   item.id,
        quantity: item.quantity - 1
      }
    })
  }, [item, applyEvent])

  return (
    <>
      <tr>
        <td className="text-end">{item.id}</td>
        <td>{item.name}</td>
        <td className="text-end">{format(item.amount)}</td>
        <td className="text-end">
          <a href="#" onClick={up}>⬆️</a>
          {' '}
          {item.quantity}
          {' '}
          <a href="#" onClick={down}>⬇️</a>
        </td>
        <td className="text-end">{format(orderItemSubtotal(item, items))}</td>
      </tr>
      {taxItems.map(taxItem => (
        <tr className="small" key={taxItem.id}>
          <td className="text-end">{taxItem.id}</td>
          <td className="text-end text-muted" colSpan={3}>Tax</td>
          <td className="text-end">{format(orderItemSubtotal(taxItem, items))}</td>
        </tr>
      ))}
    </>
  )
}
