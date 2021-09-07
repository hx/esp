import { Big } from 'big.js'

import { EventBase, createBuilder } from '../../esp'
import { Currency, Item, Order, Payment, currencyNames } from './Order'
import { orderBalance } from './orderDerivation'

type AddItemEvent = EventBase<'addItem', {
  name: string
  price: string
}>

type SetCurrencyEvent = EventBase<'setCurrency', {
  currency: Currency
}>

type MakePaymentEvent = EventBase<'makePayment', {
  method: string
  amount: string
}>

const PRICE_PATTERN = /^(\$|-\$?)?\d+(\.\d*)?$/

const AVAILABLE_METHODS: Record<string, string> = {
  'PayPal':      'paypal.hosted',
  'Credit card': 'braintree.card',
  'Cash':        'bigcommerce.cash'
}

export const orderBuilder = createBuilder<Order>({
  seed: () => ({
    currencyCode: 'AUD',
    lines: []
  }),
  eventClasses: (order, add) => {
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

    const addItemEvent = add<AddItemEvent>('addItem', 'Add item').handle(({event: {args}, reject}) => {
      if (!PRICE_PATTERN.test(args.price)) {
        return reject('Price is invalid')
      }
      const name = args.name.trim()
      if (name === '') {
        return reject('Name should not be blank')
      }

      const item: Item = {
        name:           name,
        quantity:       1,
        unitPriceExTax: new Big(args.price.replace('$', ''))
      }

      return {...order, lines: [...order.lines, item]}
    })

    addItemEvent.addArgument('name', 'Item name')
    addItemEvent.addArgument('price', 'Price')

    /**
     * Payments
     */

    if (!orderBalance(order).eq(0)) {
      const makePaymentEvent = add<MakePaymentEvent>('makePayment', 'Pay').handle(({event: {args}, reject}) => {
        if (!PRICE_PATTERN.test(args.amount)) {
          return reject('Amount is invalid')
        }

        const [providerId, methodId] = args.method.split('.', 2)

        const payment: Payment ={
          amount: new Big(args.amount.replace('$', '')),
          method: {providerId, methodId}
        }

        return {...order, lines: [...order.lines, payment]}
      })

      makePaymentEvent.addArgument('method', 'Method').options(
        Object.entries(AVAILABLE_METHODS).map(([name, id]) => ({displayName: name, value: id}))
      )
      makePaymentEvent.addArgument('amount', 'Amount')
    }
  }
})
