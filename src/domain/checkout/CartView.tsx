import React, { FC, useMemo } from 'react'
import { ItemsView } from './productLineItem/ItemsView'
import { makeFormatter } from './currency/MoneyFormatter'
import { CartInterface } from './Cart'
import { PaymentsView } from './payment/PaymentsView'
import { SummaryView } from './SummaryView'

export const CartView: FC<{ projection: CartInterface }> = ({projection: cart}) => {
  const items    = useMemo(() => cart.items(), [cart])
  const payments = useMemo(() => cart.payments(), [cart])
  const format   = useMemo(
    () => makeFormatter(cart.currencyCode),
    [cart.currencyCode]
  )

  return (
    <div className="cart-view pt-2">
      <h2>Cart: {cart.currencyCode}</h2>

      <h5>Items</h5>
      {items[0] ? <ItemsView items={items} total = {cart.total()} format={format}/> : <None/>}

      <h5>Payments</h5>
      {payments[0] ? <PaymentsView payments={payments} total={cart.totalPayments()} format={format}/> : <None/>}

      <h5>Summary</h5>
      {cart.lines[0] ? <SummaryView cart={cart} format={format}/> : <None/>}
    </div>
  )
}

const None: FC = () => <p className="text-muted"><em>None.</em></p>
