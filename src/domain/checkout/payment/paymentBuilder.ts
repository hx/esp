import Big from 'big.js'
import {EventBase} from '../../../esp'
import {EventClassCreator} from '../../../esp/EventClassCreator'
import {Cart, CartInterface} from '../Cart'
import {PAYMENT_METHODS, Payment} from './Payment'

type MakePaymentEvent = EventBase<'makePayment', {
  method: string
  amount: number
}>
export const buildPayment = (cart: CartInterface, add: EventClassCreator<CartInterface>) => {
  const balance = cart.balance()
  if (balance.eq(0)) return
  addPayment(cart, balance, add)
}

function addPayment(
  cart: CartInterface,
  balance: Big,
  add: EventClassCreator<CartInterface>
) {
  const makePaymentEvent = add<MakePaymentEvent>('makePayment', 'Pay').handle(({event: {args}}) => {
    const [providerId, methodId] = args.method.split('.', 2)

    const payment: Payment = {
      id:     cart.nextPaymentId(),
      amount: new Big(args.amount),
      method: {providerId, methodId}
    }

    return new Cart(cart.currencyCode, [...cart.lines, payment])
  })

  makePaymentEvent.addArgument('method', 'Method').options(
    Object.entries(PAYMENT_METHODS).map(([name, id]) => ({displayName: name, value: id}))
  )
  makePaymentEvent.addArgument('amount', 'Amount', balance.toNumber())
}
