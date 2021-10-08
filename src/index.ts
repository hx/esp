import { boot } from './boot'
import './css/app.scss'
import { createChessGameBuilder } from './examples/chess/builder'
import { GameView } from './examples/chess/GameView'
import { createOrderBuilder } from './examples/order/builder'
import { OrderView } from './examples/order/OrderView'
import { Welcome, createNullBuilder } from './examples/welcome'
import { CounterView } from './examples/counter/CounterView'
import { createCounterBuilder } from './examples/counter/builder'

const options = {
  welcome: () => boot(createNullBuilder(), Welcome),
  chess:   () => boot(createChessGameBuilder(), GameView),
  order:   () => boot(createOrderBuilder({currencyCode: 'AUD'}), OrderView),
  counter: () => boot(createCounterBuilder({}), CounterView)
}

// options.welcome()
options.chess()
// options.order()
// options.counter()
