import { legalMoves } from './legalMoves'
import { Move } from './Move'
import { MoveRequest } from './MoveRequest'
import { parseFen, startingPosition } from './parseFen'
import { Position, applyMoveToPosition } from './Position'

export interface Game {
  positions: Position[]
  playedMoves: Move[]
}

export const newGame = (): Game => ({
  positions:   [parseFen(startingPosition)],
  playedMoves: []
})

export const IllegalMove = new Error('Illegal move')

export const play = (game: Game, req: MoveRequest): Game => {
  const position = game.positions[game.positions.length - 1]
  const move     = legalMoves(position).find(m =>
    m.from === req.from &&
    m.to === req.to &&
    m.promoteTo === req.promoteTo
  )
  if (!move) {
    throw IllegalMove
  }
  return {
    playedMoves: [...game.playedMoves, move],
    positions: [...game.positions, applyMoveToPosition(move, position)]
  }
}

export const takeBack = (game: Game): Game => {
  if (!game.playedMoves[0]) {
    throw IllegalMove
  }
  return {
    positions: game.positions.slice(0, -1),
    playedMoves: game.playedMoves.slice(0, -1)
  }
}
