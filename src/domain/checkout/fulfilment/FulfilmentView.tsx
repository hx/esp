import Big from 'big.js'
import React, { FC, useMemo } from 'react'
import { Catalogue } from '../../catalogue/Catalogue'
import { CartInterface } from '../Cart'
import { MoneyFormatter } from '../currency/MoneyFormatter'
import { getPromotionItems, PromotionItemInterface } from '../promotion/PromotionItem'
import { PromotionItemsView } from '../promotion/PromotionItemsView'
import { getTaxItems, TaxItemInterface } from '../tax/TaxItem'
import { TaxItemsView } from '../tax/TaxItemsView'
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
        {shipments.map((shipment: Shipping) => {
          const taxItems = getTaxItems(shipment.id, cart.items())
          return (
            <React.Fragment key={shipment.id}>
              <tr className="row-header">
                <td>{shipment.id}</td>
                <td>{SHIPPING_METHODS[shipment.method]}</td>
                <td className="text-muted">{shipment.address}</td>
                <td className="text-end">{format(shipment.amount)}</td>
              </tr>
              {cart.findSaleItems(shipment.itemIds).map(saleItem => (
                <tr key={saleItem.id}>
                  <td></td>
                  <td className="text-muted">{saleItem.id}</td>
                  <td className="text-end text-muted">{catalogue.products.find(p => p.id === saleItem.productId)!.name} x {saleItem.quantity}</td>
                  <td></td>
                </tr>
              ))}
              {taxItems.map(taxItem => (
                <tr className="small" key={taxItem.id}>
                  <td></td>
                  <td className="text-muted">{taxItem.id}</td>
                  <td className="text-end text-muted">{taxItem.description}</td>
                  <td className="text-end">{format(taxItem.total(cart))}</td>
                </tr>
              ))}
            </React.Fragment>
          )
        })}
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
