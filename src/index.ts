import { boot } from './boot'
import './css/app.scss'
import { gameBuilder } from './examples/chess/builder'
import { GameView } from './examples/chess/GameView'

boot(gameBuilder, GameView)
