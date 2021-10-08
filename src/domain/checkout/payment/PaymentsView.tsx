import Big from 'big.js'
import React, { FC } from 'react'
import { MoneyFormatter } from '../currency/MoneyFormatter'
import { Payment } from './Payment'

export const PaymentsView: FC<{ payments: Payment[], total: Big, format: MoneyFormatter}> = ({payments, total, format}) => {
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
          <th className="text-end">{format(total)}</th>
        </tr>
      </tfoot>
    </table>
  )
}
