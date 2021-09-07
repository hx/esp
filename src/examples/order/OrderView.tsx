import Big from 'big.js'
import React, { FC, useMemo } from 'react'
import { Item, Order, Payment, isItem, isPayment, isSaleItem, isTaxItem } from './Order'
import {
  orderBalance,
  orderItemSubtotal,
  orderItems,
  orderItemsTotal,
  orderPayments,
  orderPaymentsTotal, orderTaxItems
} from './orderDerivation'

type MoneyFormatter = (num: Big) => string

const makeFormatter = (currency: string): MoneyFormatter => {
  const f = new Intl.NumberFormat('en-AU', {style: 'currency', currency})
  return num => f.format(num.toNumber())
}

export const OrderView: FC<{ model: Order }> = ({model: order}) => {
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

const SummaryView: FC<{order: Order, format: MoneyFormatter}> = ({order, format}) => {
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
          <th className="text-end">{balance.lt(0) ? 'Overpaid' : 'Due'}</th>
          <td className="text-end">{format(balance.abs())}</td>
        </tr>
      </tbody>
    </table>
  )
}

const PaymentsView: FC<{ payments: Payment[], format: MoneyFormatter}> = ({payments, format}) => {
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

const None: FC = () => <p className="text-muted"><em>None.</em></p>

const ItemsView: FC<{ items: Item[], format: MoneyFormatter }> = ({items, format}) => {
  if (!items[0]) {
    return null
  }

  const saleItems = useMemo(() => items.filter(isSaleItem), [items])

  return (
    <table className="table table-striped table-sm monetary">
      <thead>
        <tr>
          <th className="text-end">#</th>
          <th>Name</th>
          <th className="text-end">Each</th>
          <th className="text-end">Quantity</th>
          <th className="text-end">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        {saleItems.map((item) => {
          const taxItems = items.filter(i => isTaxItem(i) && i.saleItemID === item.id)

          return (
            <React.Fragment key={item.id}>
              <tr>
                <td className="text-end">{item.id}</td>
                <td>{item.name}</td>
                <td className="text-end">{format(item.amount)}</td>
                <td className="text-end">{item.quantity}</td>
                <td className="text-end">{format(orderItemSubtotal(item, items))}</td>
              </tr>
              {taxItems.map(taxItem => (
                <tr className="small" key={taxItem.id}>
                  <td className="text-end">{taxItem.id}</td>
                  <td className="text-end text-muted" colSpan={3}>Tax</td>
                  <td className="text-end">{format(orderItemSubtotal(taxItem, items))}</td>
                </tr>
              ))}
            </React.Fragment>
          )
        })}
      </tbody>
      <tfoot>
        <tr>
          <td/>
          <th colSpan={3} className="text-end">Items total</th>
          <th className="text-end">{format(orderItemsTotal(items))}</th>
        </tr>
      </tfoot>
    </table>
  )
}
