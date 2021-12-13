import React, { FC, useMemo } from 'react'
import { ItemsView } from './productLineItem/ItemsView'
import { makeFormatter } from './currency/MoneyFormatter'
import { PaymentsView } from './payment/PaymentsView'
import { SummaryView } from './SummaryView'
import { Props } from '../../components'
import { FulfilmentsView } from './fulfilment/FulfilmentView'
import { Store } from '../Store'

export const StoreView: FC<Props<Store>> = ({aggregate: {projection: store}}) => {
  const cart = store.cart
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
      <h5>Fulfilments</h5>
      <FulfilmentsView cart={cart} total={cart.totalShipments()} format={format} />

      <h5>Payments</h5>
      {payments[0] ? <PaymentsView payments={payments} total={cart.totalPayments()} format={format}/> : <None/>}

      <h5>Summary</h5>
      {cart.lines[0] ? <SummaryView cart={cart} format={format}/> : <None/>}
    </div>
  )
}

const None: FC = () => <p className="text-muted"><em>None.</em></p>
