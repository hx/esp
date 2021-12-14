import Big from 'big.js'
import React, { FC, useMemo } from 'react'
import { Catalogue } from '../../catalogue/Catalogue'
import { CartInterface } from '../Cart'
import { MoneyFormatter } from '../currency/MoneyFormatter'
import { SHIPPING_METHODS, Shipping } from './Shipping'

export const FulfilmentsView: FC<{ cart: CartInterface, catalogue: Catalogue, total: Big, format: MoneyFormatter}> = ({cart, total, catalogue, format}) => {
  const shipments = useMemo(() => cart.shipments(), [cart])
  if (!shipments[0]) {
    return null
  }
  return (
    <table className="table table-sm monetary">
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th className="text-end"></th>
          <th className="text-end"></th>
        </tr>
      </thead>
      <tbody>
        {shipments.map((shipment: Shipping) => (
          <>
            <tr key={shipment.id}>
              <td>{shipment.id}</td>
              <td>{SHIPPING_METHODS[shipment.method]}</td>
              <td/>
              <td className="text-end">{format(shipment.amount)}</td>
            </tr>
            {cart.findSaleItems(shipment.itemIds).map(saleItem => (
              <tr key="${shipment.id}-${product.id}">
                <td></td>
                <td>{saleItem.id}</td>
                <td>{catalogue.products.find(p => p.id === saleItem.productId)!.name} x {saleItem.quantity}</td>
                <td></td>
              </tr>
            ))}
          </>
        ))}

      </tbody>
      <tfoot>
        <tr>
          <td/>
          <td/>
          <th className="text-end">Subtotal</th>
          <th className="text-end">{format(total)}</th>
        </tr>
      </tfoot>
    </table>
  )
}
