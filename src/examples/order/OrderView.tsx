import React, { FC, useMemo } from 'react'
import { ItemsView } from './ItemsView'
import { makeFormatter } from './MoneyFormatter'
import { Order } from './Order'
import {
  orderItems,
  orderPayments,
} from './orderDerivation'
import { PaymentsView } from './PaymentsView'
import { SummaryView } from './SummaryView'

export const OrderView: FC<{ projection: Order }> = ({projection: order}) => {
  const items    = useMemo(() => orderItems(order), [order])
  const payments = useMemo(() => orderPayments(order), [order])
  const format   = useMemo(
    () => makeFormatter(order.currencyCode),
    [order.currencyCode]
  )

  return (
    <div className="order-view pt-2">
      <h2>Order: {order.currencyCode}</h2>

      <h5>Items</h5>
      {items[0] ? <ItemsView items={items} format={format}/> : <None/>}

      <h5>Payments</h5>
      {payments[0] ? <PaymentsView payments={payments} format={format}/> : <None/>}

      <h5>Summary</h5>
      {order.lines[0] ? <SummaryView order={order} format={format}/> : <None/>}
    </div>
  )
}

const None: FC = () => <p className="text-muted"><em>None.</em></p>
