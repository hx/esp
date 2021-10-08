import { boot } from './boot'
import './css/app.scss'
import { createChessGameAggregate } from './examples/chess/aggregate'
import { GameView } from './examples/chess/GameView'
import { createOrderAggregate } from './examples/order/aggregate'
import { OrderView } from './examples/order/OrderView'
import { Welcome, createNullBuilder } from './examples/welcome'
import { CounterView } from './examples/counter/CounterView'
import { createCounterBuilder } from './examples/counter/builder'

const options = {
  welcome: () => boot(createNullAggregate(), Welcome),
  chess:   () => boot(createChessGameAggregate(), GameView),
  order:   () => boot(createOrderAggregate({currencyCode: 'AUD'}), OrderView)
  counter: () => boot(createCounterBuilder({}), CounterView)
}

options.welcome()
// options.chess()
// options.order()
// options.counter()
