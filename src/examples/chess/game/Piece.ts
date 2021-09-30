import { Color } from './Color'
import { Language, english } from './i18n'
import { PieceType } from './PieceType'

export interface Piece {
  color: Color
  type: PieceType
}

export type Figurines = Record<Color, Record<PieceType, string>>

export const figurines: Figurines = {
  [Color.Black]: {
    [PieceType.Pawn]: '♟',
    [PieceType.Knight]: '♞',
    [PieceType.Bishop]: '♝',
    [PieceType.Rook]: '♜',
    [PieceType.Queen]: '♛',
    [PieceType.King]: '♚',
  },
  [Color.White]: {
    [PieceType.Pawn]: '♙',
    [PieceType.Knight]: '♘',
    [PieceType.Bishop]: '♗',
    [PieceType.Rook]: '♖',
    [PieceType.Queen]: '♕',
    [PieceType.King]: '♔',
  }
}

export const figurine = (piece: Piece) => figurines[piece.color][piece.type]

export const letter = (piece: Piece, language: Language = english) => {
  const letter = language.pieces[piece.type].letter
  return piece.color === Color.White ? letter : letter.toLowerCase()
}
