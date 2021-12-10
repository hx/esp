import { boot } from './boot'
import './css/app.scss'
import { createChessGameAggregate } from './examples/chess/aggregate'
import { GameView } from './examples/chess/GameView'
import { createOrderAggregate } from './examples/order/aggregate'
import { OrderView } from './examples/order/OrderView'
import { Welcome, createNullAggregate } from './examples/welcome'

const options = {
  welcome: () => boot(createNullAggregate(), Welcome),
  chess:   () => boot(createChessGameAggregate(), GameView),
  order:   () => boot(createOrderAggregate({currencyCode: 'AUD'}), OrderView)
}

options.welcome()
// options.chess()
// options.order()
