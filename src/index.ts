import { runApp } from './app'
import './css/app.scss'
import { gameBuilder } from './examples/chess/builder'
import { GameView } from './examples/chess/GameView'

runApp(gameBuilder, GameView)
