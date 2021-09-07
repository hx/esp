import { Big } from 'big.js'

import { EventBase, createBuilder } from '../../esp'
import { AnyArgs } from '../../esp/Builder'
import { Currency, Item, Order, Payment, currencyNames } from './Order'
import { nextID, orderBalance, orderItems, orderPayments } from './orderDerivation'

type AddItemEvent = EventBase<'addItem', {
  name: string
  price: number
  quantity: number
}>

type SetCurrencyEvent = EventBase<'setCurrency', {
  currency: Currency
}>

type MakePaymentEvent = EventBase<'makePayment', {
  method: string
  amount: number
}>

interface ItemTaxEvent extends AnyArgs {
  itemID: number
  amount: string
  isPercentage: boolean
}

const AVAILABLE_METHODS: Record<string, string> = {
  'PayPal':      'paypal.hosted',
  'Credit card': 'braintree.card',
  'Cash':        'bigcommerce.cash'
}

export const orderBuilder = () => createBuilder<Order>(
  {
    currencyCode: 'AUD',
    lines: []
  },
  (order, add) => {
    /**
     * Currency
     */

    if (!order.lines[0]) {
      add<SetCurrencyEvent>('setCurrency', 'Change currency')
        .handle(({event}) => ({...order, currencyCode: event.args.currency}))
        .addArgument('currency', 'Currency')
        .options(
          Object.entries(currencyNames).map(([code, name]) => ({displayName: name, value: code as Currency}))
        )
    }

    /**
     * Line items
     */
    const items = orderItems(order)
    const nextItemID = nextID(items)

    const addItemEvent = add<AddItemEvent>('addItem', 'Add item').handle(({event: {args}, reject}) => {
      const name = args.name.trim()
      if (name === '') {
        return reject('Name should not be blank')
      }

      const item: Item = {
        id:             nextItemID,
        name:           name,
        quantity:       args.quantity,
        unitPriceExTax: new Big(args.price)
      }

      return {...order, lines: [...order.lines, item]}
    })

    addItemEvent.addArgument('name', 'Item name', `Item #${nextItemID}`)
    addItemEvent.addArgument('price', 'Price', 1.23)
    addItemEvent.addArgument('quantity', 'Quantity', 1)

    /**
     * Payments
     */

    const balance = orderBalance(order)
    if (!balance.eq(0)) {
      const makePaymentEvent = add<MakePaymentEvent>('makePayment', 'Pay').handle(({event: {args}, reject}) => {
        const [providerId, methodId] = args.method.split('.', 2)

        const payment: Payment = {
          id:     nextID(orderPayments(order)),
          amount: new Big(args.amount),
          method: {providerId, methodId}
        }

        return {...order, lines: [...order.lines, payment]}
      })

      makePaymentEvent.addArgument('method', 'Method').options(
        Object.entries(AVAILABLE_METHODS).map(([name, id]) => ({displayName: name, value: id}))
      )
      makePaymentEvent.addArgument('amount', 'Amount', balance.toNumber())
    }
  }
)
