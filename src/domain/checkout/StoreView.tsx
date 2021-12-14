import React, { FC, useMemo } from 'react'
import { Props } from '../../components'

import { Store } from '../Store'
import { makeFormatter } from './currency/MoneyFormatter'
import { FulfilmentsView } from './fulfilment/FulfilmentView'
import { InventoryItem } from './InventoryItem'
import { PaymentsView } from './payment/PaymentsView'
import { ItemsView } from './productLineItem/ItemsView'
import { SummaryView } from './SummaryView'

export const StoreView: FC<Props<Store>> = ({aggregate: {projection: store}}) => {
  const {cart, inventory, catalogue} = store
  const items    = useMemo(() => cart.items(), [cart])
  const payments = useMemo(() => cart.payments(), [cart])
  const refunds  = useMemo(() => cart.refunds(), [cart])
  const shipments = useMemo(() => cart.shipments(), [cart])
  const format   = useMemo(
    () => makeFormatter(cart.currencyCode),
    [cart.currencyCode]
  )

  return <>
    <div className="inventory">
      <label>Inventory</label>
      {inventory.onHand.map(entry => <InventoryItem entry={entry} catalogue={catalogue} key={entry.productId}/>)}
    </div>
    <div className="cart-view pt-2">
      <h2>Cart: {cart.currencyCode}</h2>

      <h5>Items</h5>
      {items[0] ? <ItemsView items={items} cart = {cart} format={format} catalogue={catalogue}/> : <None/>}

      <h5>Shipping</h5>
      {shipments[0] ? <FulfilmentsView cart={cart} catalogue={catalogue} total={cart.totalShipments()} format={format} /> : <None/>}

      <h5>Payments</h5>
      {payments[0] ? <PaymentsView payments={payments} refunds={refunds} total={cart.totalPayments().plus(cart.totalRefunds())} format={format}/> : <None/>}

      <h5>Summary</h5>
      {cart.lines[0] ? <SummaryView cart={cart} format={format}/> : <None/>}
    </div>
  </>
}

const None: FC = () => <p className="text-muted"><em>None.</em></p>
