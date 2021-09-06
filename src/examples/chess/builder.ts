import { EventBase, createBuilder } from '../../esp'
import { Game, PieceType, newGame, play, takeBack } from './game'
import { Coordinate, coordinate } from './game/Coordinate'
import { english } from './game/i18n'
import { legalMoves } from './game/legalMoves'
import { Move } from './game/Move'

interface MoveEvent extends EventBase {
  name: 'move'
  from: Coordinate
  to: Coordinate
  promoteTo?: PieceType
}

interface TakeBackEvent extends EventBase {
  name: 'takeBack'
}

const describePiece = (move: Move) => {
  const {colors, pieces} = english
  const {color, type}    = move.piece
  return `${colors[color]} ${pieces[type].name} (${coordinate(move.from)})`
}

export const gameBuilder = createBuilder<Game>({
  seed: newGame,
  eventClasses(game, add) {
    const position     = game.positions[game.positions.length - 1]
    const moves        = legalMoves(position)
    const movesByPiece = moves.filter((move, index, self) => self.findIndex(m => m.from === move.from) === index)

    if (movesByPiece[0]) {
      const moveEvent = add<MoveEvent>('move', 'Move').handle(e => play(game, e))

      moveEvent.addArgument('from', 'Piece').options(
        movesByPiece.map(move => ({displayName: describePiece(move), value: move.from}))
      )

      const selectedFrom          = moveEvent.getArgument('from')
      const movesForSelectedPiece = moves.filter(move => move.from === selectedFrom)

      moveEvent.addArgument('to', 'Destination').options(
        movesForSelectedPiece.map(move => ({displayName: coordinate(move.to).toString(), value: move.to}))
      )

      const selectedTo       = moveEvent.getArgument('to')
      const promotionOptions = movesForSelectedPiece.filter(move => move.from === selectedFrom && move.to === selectedTo)

      if (promotionOptions[1]) {
        moveEvent.addArgument('promoteTo', 'Promote to').options(
          promotionOptions.map(move => ({displayName: english.pieces[move.promoteTo!].name, value: move.promoteTo}))
        )
      }
    }

    if (game.playedMoves[0]) {
      add<TakeBackEvent>('takeBack', 'Take back').handle(() => takeBack(game))
    }
  }
})
