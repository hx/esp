import React, {FC} from 'react'
import {MoneyFormatter} from '../currency/MoneyFormatter'
import { Shipping } from './Shipping'
import Big from 'big.js'

export const FulfilmentItemsView: FC<{ shippingItems: Shipping[], format: MoneyFormatter, total: Big }> = ({shippingItems, format, total}) => {
  if (!shippingItems[0]) {
    return null
  }

  return (
    <table className="table table-striped table-sm monetary">
      <thead>
        <tr>
          <th className="text-end">#</th>
          <th>Method</th>
          <th className="text-end">Amount</th>
        </tr>
      </thead>
      <tbody>
        {shippingItems.map((shipment) => (
          <React.Fragment key={shipment.id}>
            <tr className="small">
              <th className="text-end text-muted">{shipment.method}</th>
              <td className="text-end">{format(shipment.amount)}</td>
            </tr>
          </React.Fragment>
        ))
        }
      </tbody>
      <tfoot>
        <tr>
          <td/>
          <th className="text-end">FulfilmentMethod</th>
          <th className="text-end">{format(total)}</th>
        </tr>
      </tfoot>
    </table>
  )
}
