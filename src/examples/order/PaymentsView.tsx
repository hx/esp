import React, { FC } from 'react'
import { MoneyFormatter } from './MoneyFormatter'
import { Payment } from './Order'
import { orderPaymentsTotal } from './orderDerivation'

export const PaymentsView: FC<{ payments: Payment[], format: MoneyFormatter}> = ({payments, format}) => {
  if (!payments[0]) {
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
        {payments.map(({amount, id, method: {methodId, providerId}}) => (
          <tr key={id}>
            <td className="text-end">{id}</td>
            <td>{methodId} <span className="text-muted">({providerId})</span></td>
            <td className="text-end">{format(amount)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td/>
          <th className="text-end">Payments subtotal</th>
          <th className="text-end">{format(orderPaymentsTotal(payments))}</th>
        </tr>
      </tfoot>
    </table>
  )
}
