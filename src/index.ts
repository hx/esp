import { boot } from './boot'
import './css/app.scss'
import { gameBuilder } from './examples/chess/builder'
import { GameView } from './examples/chess/GameView'
import { orderBuilder } from './examples/order/builder'
import { OrderView } from './examples/order/OrderView'

const options = {
  chess: () => boot(gameBuilder(), GameView),
  order: () => boot(orderBuilder(), OrderView)
}

// options.chess()
options.order()
