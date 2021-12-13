import Big from 'big.js'
import React, { FC, useMemo } from 'react'
import { MoneyFormatter } from '../currency/MoneyFormatter'
import { SHIPPING_METHODS, Shipping } from './Shipping'
import { CartInterface } from '../Cart'

export const FulfilmentsView: FC<{ cart: CartInterface, total: Big, format: MoneyFormatter}> = ({cart, total, format}) => {
  const shipments = useMemo(() => cart.shipments(), [cart])
  if (!shipments[0]) {
    return null
  }
  return (
    <table className="table table-striped table-sm monetary">
      <thead>
        <tr>
          <th>Method</th>
          <th className="text-end">Items</th>
          <th className="text-end">Amount</th>
        </tr>
      </thead>
      <tbody>
        {shipments.map((shipment: Shipping) => (
          <tr key={shipment.id}>
            <td>{SHIPPING_METHODS[shipment.method]}</td>
            <td className="text-end">{cart.findSaleItems(shipment.itemIds).map(shipment => shipment.name).join(', ')}</td>
            <td className="text-end">{format(shipment.amount)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td/>
          <th className="text-end">Fulfilments subtotal</th>
          <th className="text-end">{format(total)}</th>
        </tr>
      </tfoot>
    </table>
  )
}
