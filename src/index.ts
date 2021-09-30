import { boot } from './boot'
import './css/app.scss'
import { createChessGameBuilder } from './examples/chess/builder'
import { GameView } from './examples/chess/GameView'
import { createOrderBuilder } from './examples/order/builder'
import { OrderView } from './examples/order/OrderView'
import { Welcome, createNullBuilder } from './examples/welcome'

const options = {
  welcome: () => boot(createNullBuilder(), Welcome),
  chess:   () => boot(createChessGameBuilder(), GameView),
  order:   () => boot(createOrderBuilder({currencyCode: 'AUD'}), OrderView)
}

options.welcome()
// options.chess()
// options.order()
