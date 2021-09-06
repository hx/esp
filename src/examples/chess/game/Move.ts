import { coordinate, file, rank } from './Coordinate'
import { Language, english } from './i18n'
import { MoveRequest } from './MoveRequest'
import { Piece } from './Piece'
import { PieceType } from './PieceType'

export interface Move extends MoveRequest {
  piece: Piece
  capturedPiece?: Piece
  isCheck: boolean
  isEnPassant: boolean
}

export const moveIsCastling = (move: Move) => {
  if (move.piece.type === PieceType.King && file(move.from) === 4) {
    const to = file(move.to)
    return to === 2 || to === 6
  }
  return false
}

export const moveIsPromotion = (move: Move) =>
  move.piece.type === PieceType.Pawn &&
  rank(move.to) % 7 === 0

// TODO: internationalize
export const describeMove = (move: Move, {colors, pieces}: Language = english) => {
  const out: string[] = [colors[move.piece.color], ' ']
  if (move.promoteTo !== undefined) {
    out.push(pieces[PieceType.Pawn].name)
  } else {
    out.push(pieces[move.piece.type].name)
  }
  out.push(
    ' ',
    coordinate(move.from).toString(),
    ' to ',
    coordinate(move.to).toString(),
  )
  if (move.capturedPiece !== undefined) {
    out.push(
      ', capture ',
      pieces[move.capturedPiece.type].name
    )
    if (move.isEnPassant) {
      out.push(' en passant')
    }
  }
  if (move.promoteTo !== undefined) {
    out.push(', promote to ', pieces[move.promoteTo].name)
  }
  if (moveIsCastling(move)) {
    out.push(', ', file(move.to) === 2 ? 'queen' : 'king', 'side castle')
  }
  if (move.isCheck) {
    out.push(', check')
  }
  return out.join('')
}
