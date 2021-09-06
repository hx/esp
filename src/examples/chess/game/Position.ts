import { CastlingAvailability } from './CastlingAvailability'
import { Color } from './Color'
import { Coordinate, coordinateFromFileAndRank, file, rank } from './Coordinate'
import { castlingSides } from './legalMoves'
import { Move, moveIsCastling } from './Move'
import { PieceType } from './PieceType'
import { Placement } from './Placement'

export interface Position {
  placement: Placement
  nextPlayer: Color
  castlingAvailability: CastlingAvailability
  enPassantTarget: Coordinate
  halfMoves: number

  // Starts at 0, one less than FEN
  fullMoves: number
}

const InvalidCastling = new Error('Invalid castling move')

export const applyMoveToPosition = (move: Move, position: Position): Position => {
  const placement = {
    ...position.placement,
    [move.to]: move.promoteTo ? {...move.piece, type: move.promoteTo} : move.piece
  }
  const castlingAvailability = {...position.castlingAvailability}
  delete placement[move.from]
  if (move.isEnPassant) {
    delete placement[coordinateFromFileAndRank(file(move.to), rank(move.from))]
  }
  if (moveIsCastling(move)) {
    const side = castlingSides.find(s => s.path[1] === file(move.to))
    if (!side) {
      throw InvalidCastling
    }
    const r = rank(move.to)
    const rookCoord = coordinateFromFileAndRank(side.rookFile, r)
    placement[coordinateFromFileAndRank(side.path[0], r)] = placement[rookCoord]
    placement[rookCoord] = undefined
    delete castlingAvailability[rookCoord]
  }
  const halfMoves = position.halfMoves + 1
  let enPassantTarget = 0
  if (move.piece.type === PieceType.Pawn) {
    const diff = move.to - move.from
    if (Math.abs(diff) === 16) {
      enPassantTarget = move.from + diff/2
    }
  }

  return {
    placement, castlingAvailability, halfMoves, enPassantTarget,
    nextPlayer: 1 - position.nextPlayer,
    fullMoves:  Math.floor(halfMoves / 2)
  }
}
