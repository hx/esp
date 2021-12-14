import { EventBase } from '../../../esp'
import { EventClassCreator } from '../../../esp/EventClassCreator'
import { Cart } from '../Cart'
import {Store} from '../../Store'

export type Currency = 'AUD' | 'USD' | 'NZD' | 'GBP'

export const currencyNames: Record<Currency, string> = {
  AUD: 'Australian Dollars',
  USD: 'US Dollars',
  NZD: 'New Zealand Dollars',
  GBP: 'Great British Pounds'
}

type SetCurrencyEvent = EventBase<'setCurrency', {
  currency: Currency
}>

export const buildCurrency = (store: Store, add: EventClassCreator<Store>) => {
  const cart = store.cart
  if (cart.hasItems()) return

  add<SetCurrencyEvent>('setCurrency', 'Change currency')
    .handle(({event}) => ({...store, cart: new Cart(event.args.currency, cart.lines, cart.taxCalculations, cart.paid)}))
    .addArgument('currency', 'Currency')
    .options(
      Object.entries(currencyNames).map(([code, name]) => ({displayName: name, value: code as Currency}))
    )
}
