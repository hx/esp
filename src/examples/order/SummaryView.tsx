import React, { FC, useMemo } from 'react'
import { MoneyFormatter } from './MoneyFormatter'
import { Order } from './Order'
import {
  orderBalance,
  orderItems,
  orderItemsTotal,
  orderPayments,
  orderPaymentsTotal,
  orderTaxItems
} from './orderDerivation'

export const SummaryView: FC<{order: Order, format: MoneyFormatter}> = ({order, format}) => {
  if (!order.lines[0]) {
    return null
  }

  const items    = useMemo(() => orderItems(order), [order])
  const payments = useMemo(() => orderPayments(order), [order])
  const taxItems = useMemo(() => orderTaxItems(order), [order])

  const itemsTotal    = useMemo(() => orderItemsTotal(items), [items])
  const paymentsTotal = useMemo(() => orderPaymentsTotal(payments), [payments])

  const balance = useMemo(() => orderBalance(order), [order])
  const style = balance.eq(0) ? 'success' : balance.lt(0) ? 'warning' : 'danger'
  const status = balance.eq(0) ? 'Paid' : balance.lt(0) ? 'Overpaid' : 'Due'

  return (
    <table className="table table-striped table-sm">
      <tbody>
        <tr>
          <th className="text-end">Items total</th>
          <td className="text-end">{format(itemsTotal)}</td>
        </tr>
        {taxItems[0] &&
      <tr className="small">
        <th className="text-end text-muted">Includes tax</th>
        <td className="text-end">{format(orderItemsTotal(taxItems, items))}</td>
      </tr>
        }
        <tr>
          <th className="text-end">Payments total</th>
          <td className="text-end">{format(paymentsTotal)}</td>
        </tr>
        <tr className={`text-${style}`}>
          <th className="text-end">{status}</th>
          <td className="text-end">{format(balance.abs())}</td>
        </tr>
      </tbody>
    </table>
  )
}
