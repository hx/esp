import { boot } from './boot'
import './css/app.scss'
import {Cart} from './domain/checkout/Cart'
import { createChessGameAggregate } from './examples/chess/aggregate'
import { GameView } from './examples/chess/GameView'
import { createOrderAggregate } from './examples/order/aggregate'
import { OrderView } from './examples/order/OrderView'
import {createCartAggregate} from './domain/checkout/aggregate'
import { CartView } from './domain/checkout/CartView'
import { Welcome, createNullAggregate } from './examples/welcome'

import { CounterView } from './examples/counter/CounterView'
import { createCounterAggregate } from './examples/counter/builder'

const options = {
  welcome: () => boot(createNullAggregate(), Welcome),
  chess: () => boot(createChessGameAggregate(), GameView),
  order:   () => boot(createOrderAggregate({currencyCode: 'AUD'}), OrderView),
  checkout:() => boot(createCartAggregate(new Cart('AUD', [])), CartView),
  counter: () => boot(createCounterAggregate({}), CounterView)
}

// options.welcome()
// options.chess()
// options.order()
// options.counter()
options.checkout()
