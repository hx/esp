import Big from 'big.js'
import { EventBase } from '../../../esp'
import { EventClassCreator } from '../../../esp/EventClassCreator'
import { Store } from '../../Store'
import { Cart } from '../Cart'
import { Payment, PAYMENT_METHODS } from './Payment'

type MakePaymentEvent = EventBase<'makePayment', {
  method: string
  amount: number
}>
export const buildPayment = (store: Store, add: EventClassCreator<Store>) => {
  const balance = store.cart.balance()
  if (balance.eq(0)) return
  addPayment(store, balance, add)
}

function addPayment(
  store: Store,
  balance: Big,
  add: EventClassCreator<Store>
) {
  const cart = store.cart
  const makePaymentEvent = add<MakePaymentEvent>('makePayment', 'Pay').handle(({event: {args}}) => {
    const [providerId, methodId] = args.method.split('.', 2)
    const payment: Payment = {
      id:     cart.nextPaymentId(),
      amount: new Big(args.amount),
      method: {providerId, methodId}
    }

    return {
      ...store,
      cart: new Cart(cart.currencyCode, [...cart.lines, payment])
    }
  })

  makePaymentEvent.addArgument('method', 'Method').options(
    Object.entries(PAYMENT_METHODS).map(([name, id]) => ({displayName: name, value: id}))
  )
  makePaymentEvent.addArgument('amount', 'Amount', balance.toNumber())
}
