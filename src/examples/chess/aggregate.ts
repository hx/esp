import { EventBase, createAggregate } from '../../esp'
import { PieceType, newGame, play, takeBack } from './game'
import { Coordinate, coordinate } from './game/Coordinate'
import { english } from './game/i18n'
import { legalMoves } from './game/legalMoves'
import { Move, describeMove } from './game/Move'

type MoveEvent = EventBase<'move', {
  from: Coordinate
  to: Coordinate
  promoteTo?: PieceType
}>

type TakeBackEvent = EventBase<'takeBack'>

const describePiece = (move: Move) => {
  const {colors, pieces} = english
  const {color, type}    = move.piece
  return `${colors[color]} ${pieces[type].name} (${coordinate(move.from)})`
}

export const createChessGameAggregate = () => createAggregate(newGame(), (game, add) => {
  const position     = game.positions[game.positions.length - 1]
  const moves        = legalMoves(position)
  const movesByPiece = moves.filter((move, index, self) => self.findIndex(m => m.from === move.from) === index)

  if (movesByPiece[0]) {
    const moveEvent = add<MoveEvent>('move', 'Move').handle(({event}) => {
      const newGame = play(game, event.args)
      event.description = describeMove(newGame.playedMoves[newGame.playedMoves.length - 1])
      return newGame
    })

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
})
