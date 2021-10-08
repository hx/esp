import {EventBase} from '../../../esp'
import {EventClassCreator} from '../../../esp/EventClassCreator'
import {Cart, CartInterface} from '../Cart'

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

export const buildCurrency = (cart: CartInterface, add: EventClassCreator<CartInterface>) => {
  if (cart.hasItems()) return

  add<SetCurrencyEvent>('setCurrency', 'Change currency')
    .handle(({event}) => new Cart(event.args.currency, cart.lines))
    .addArgument('currency', 'Currency')
    .options(
      Object.entries(currencyNames).map(([code, name]) => ({displayName: name, value: code as Currency}))
    )
}
