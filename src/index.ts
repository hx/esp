import { boot } from './boot'
import './css/app.scss'
import { createChessGameBuilder } from './examples/chess/builder'
import { GameView } from './examples/chess/GameView'
import { createOrderBuilder } from './examples/order/builder'
import { OrderView } from './examples/order/OrderView'

const options = {
  chess: () => boot(createChessGameBuilder(), GameView),
  order: () => boot(createOrderBuilder({currencyCode: 'AUD'}), OrderView)
}

options.chess()
// options.order()
