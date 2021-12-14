import { boot } from './boot'
import './css/app.scss'
import {Cart} from './domain/checkout/Cart'
import { createChessGameAggregate } from './examples/chess/aggregate'
import { GameView } from './examples/chess/GameView'
import { createOrderAggregate } from './examples/order/aggregate'
import { OrderView } from './examples/order/OrderView'
import { Welcome, createNullAggregate } from './examples/welcome'

import { CounterView } from './examples/counter/CounterView'
import { createCounterAggregate } from './examples/counter/builder'
import { createStore } from './domain/storeBuilder'
import { StoreView } from './domain/checkout/StoreView'

const options = {
  welcome:  () => boot(createNullAggregate(), Welcome),
  chess:    () => boot(createChessGameAggregate(), GameView, 'Chess'),
  order:    () => boot(createOrderAggregate({currencyCode: 'AUD'}), OrderView),
  checkout: () => boot(createStore(new Cart('AUD', [], [])), StoreView),
  counter:  () => boot(createCounterAggregate({}), CounterView)
}

// options.welcome()
// options.chess()
// options.order()
// options.counter()
options.checkout()
