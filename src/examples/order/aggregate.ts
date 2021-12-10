import { Big } from 'big.js'

import { EventBase, createAggregate } from '../../esp'
import { EventClassBuilder } from '../../esp/Aggregate'
import { replaceAtIndex } from '../../utilities'
import { Currency, Order, Payment, SaleItem, TaxItem, currencyNames, isItem, isSaleItem } from './Order'
import { nextID, orderBalance, orderItems, orderPayments, orderSaleItems } from './orderDerivation'

type AddSaleItemEvent = EventBase<'addItem', {
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

type ChangeQuantityEvent = EventBase<'changeQuantity', {
  itemID: number
  quantity: number
}>

type SingleItemTaxEvent = EventBase<'singleItemTax', {
  itemID: number
  amount: number
  isFraction: boolean
}>

type MultiItemTaxEvent = EventBase<'multiItemTax', {
  itemIDs: string
  amount: number
  isFraction: boolean
}>

const AVAILABLE_METHODS: Record<string, string> = {
  'PayPal':      'paypal.hosted',
  'Credit card': 'braintree.card',
  'Cash':        'bigcommerce.cash'
}

const DEFAULTS: Order = {currencyCode: 'AUD', lines: []}

export const createOrderAggregate = (order: Partial<Order> = {}) => createAggregate(
  {...DEFAULTS, ...order},
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
     * Sale items
     */

    const saleItems  = orderSaleItems(order)
    const nextItemID = nextID(orderItems(order))

    const addItemEvent = add<AddSaleItemEvent>('addItem', 'Add item').handle(({event: {args}, reject}) => {
      const name = args.name.trim()
      if (name === '') {
        return reject('Name should not be blank')
      }

      const item: SaleItem = {
        id:             nextItemID,
        name:           name,
        quantity:       args.quantity,
        amount: new Big(args.price)
      }

      return {...order, lines: [...order.lines, item]}
    })

    addItemEvent.addArgument('name', 'Item name', `Item #${nextItemID}`)
    addItemEvent.addArgument('price', 'Price', 9.0909)
    addItemEvent.addArgument('quantity', 'Quantity', 1)

    /**
     * Payments
     */

    const balance = orderBalance(order)
    if (!balance.eq(0)) {
      const makePaymentEvent = add<MakePaymentEvent>('makePayment', 'Pay').handle(({event: {args}}) => {
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

    if (saleItems[0]) {
      /**
       * Change line quantity
       */

      const changeQuantityEvent = add<ChangeQuantityEvent>('changeQuantity', 'Change line quantity')
        .handle(({event: {args}, reject}) => {
          const itemIndex = order.lines.findIndex(item => item.id === args.itemID && isItem(item))
          if (itemIndex === -1) {
            return reject('Invalid item ID')
          }

          const item: SaleItem = {
            ...order.lines[itemIndex] as SaleItem,
            quantity: args.quantity
          }

          return {...order, lines: replaceAtIndex(order.lines, itemIndex, item)}
        })

      const lastSaleItem = saleItems[saleItems.length - 1]

      const addSaleItemArgument = <T extends EventBase<string, {itemID: number}>>(builder: EventClassBuilder<Order, T>) =>
        builder.addArgument('itemID', 'Item', lastSaleItem.id).options(
          saleItems.map(item => ({displayName: `#${item.id}. ${item.name}`, value: item.id}))
        )

      addSaleItemArgument(changeQuantityEvent)
      changeQuantityEvent.addArgument('quantity', 'Quantity', lastSaleItem.quantity)

      /**
       * Flat rate tax
       */

      const singleItemTaxEvent = add<SingleItemTaxEvent>('singleItemTax', 'Tax single item')
        .handle(({event: {args: {amount, isFraction, itemID}}}) => {
          const item: TaxItem = {
            id:         nextItemID,
            saleItemID: itemID,
            amount:     new Big(amount),
            isFraction
          }

          return {...order, lines: [...order.lines, item]}
        })

      addSaleItemArgument(singleItemTaxEvent)
      singleItemTaxEvent.addArgument('amount', 'Amount', 0.1)
      singleItemTaxEvent.addArgument('isFraction', 'Fractional', true)

      if (saleItems[1]) {
        const multiItemTaxEvent = add<MultiItemTaxEvent>('multiItemTax', 'Tax many items')
          .handle(({event: {args: {amount, isFraction, itemIDs}}, reject}) => {
            if (!/^\s*\d+(\s*,\s*\d+)*\s*$/.test(itemIDs)) {
              return reject('Item IDs should be comma-separated integers')
            }
            const ids   = itemIDs.trim().split(/\s*,\s*/).map(Number)
            const items = orderItems(order)
            for (const id of ids) {
              const item = items.find(i => i.id === id)
              if (!item) {
                return reject(`Item ${id} not found`)
              }
              if (!isSaleItem(item)) {
                return reject(`Item ${id} is not a sales item`)
              }
            }
            const taxItems: TaxItem[] = ids.map((saleItemID, i) => ({
              saleItemID, isFraction,
              id:     nextItemID + i,
              amount: new Big(amount)
            }))
            return {...order, lines: [...order.lines, ...taxItems]}
          })

        multiItemTaxEvent.addArgument('itemIDs', 'Item IDs', saleItems.map(i => i.id).join(', '))
        multiItemTaxEvent.addArgument('amount', 'Amount', 0.1)
        multiItemTaxEvent.addArgument('isFraction', 'Fractional', true)
      }
    }
  }
)
