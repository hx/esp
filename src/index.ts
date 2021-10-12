import { boot } from './boot'
import './css/app.scss'
import { Welcome, createNullBuilder } from './examples/welcome'
import { GameView, createChessGameBuilder } from './examples/chess'
import { OrderView, createOrderBuilder } from './examples/order'
import { CounterView, createCounterBuilder } from './examples/counter'

const options = {
  welcome: () => boot(createNullBuilder(), Welcome),
  chess:   () => boot(createChessGameBuilder(), GameView),
  order:   () => boot(createOrderBuilder({currencyCode: 'AUD'}), OrderView),
  counter: () => boot(createCounterBuilder(), CounterView)
}

// options.welcome()
options.chess()
// options.order()
// options.counter()
