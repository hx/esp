import React, { FC, useMemo } from 'react'
import { MoneyFormatter } from './currency/MoneyFormatter'
import { CartInterface } from './Cart'

export const SummaryView: FC<{cart: CartInterface, format: MoneyFormatter}> = ({cart, format}) => {
  if (!cart.lines[0]) {
    return null
  }

  const items    = useMemo(() => cart.items(), [cart])
  const payments = useMemo(() => cart.payments(), [cart])
  const taxItems = useMemo(() => cart.taxItems(), [cart])
  const promotionItems = useMemo(() => cart.promotionItems(), [cart])
  const shipments = useMemo(() => cart.shipments(), [cart])

  const itemsTotal = useMemo(() => cart.itemsTotal(), [items])
  const promotionTotal = useMemo(() => cart.totalPromotions(), [taxItems])
  const shippingTotal = useMemo(() => cart.totalShipments(), [taxItems])
  const taxTotal = useMemo(() => cart.totalTax(), [taxItems])
  const paymentsTotal = useMemo(() => cart.totalPayments(), [payments])

  const balance = useMemo(() => cart.balance(), [cart])
  const style = balance.eq(0) ? 'success' : balance.lt(0) ? 'warning' : 'danger'
  const status = balance.eq(0) ? 'Paid' : balance.lt(0) ? 'Overpaid' : 'Due'

  return (
    <table className="table table-striped table-sm">
      <tbody>
        <tr>
          <th className="text-end">Items Total</th>
          <td className="text-end">{format(itemsTotal)}</td>
        </tr>
        {promotionItems[0] &&
          <tr>
            <th className="text-end">Promotion Total</th>
            <td className="text-end">-{format(promotionTotal)}</td>
          </tr>
        }
        {shipments[0] &&
          <tr>
            <th className="text-end">Shipping Total</th>
            <td className="text-end">{format(shippingTotal)}</td>
          </tr>
        }
        {taxItems[0] &&
          <tr className="small">
            <th className="text-end text-muted">Includes tax</th>
            <td className="text-end">{format(taxTotal)}</td>
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
