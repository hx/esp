import { Color } from './Color'
import { PieceType } from './PieceType'

export interface PieceTranslation {
  letter: string
  name: string
}

export interface Language {
  pieces: Record<PieceType, PieceTranslation>
  colors: Record<Color, string>
}

export const english: Language = {
  pieces: {
    [PieceType.Pawn]:   {letter: 'P', name: 'Pawn'},
    [PieceType.Knight]: {letter: 'N', name: 'Knight'},
    [PieceType.Bishop]: {letter: 'B', name: 'Bishop'},
    [PieceType.Rook]:   {letter: 'R', name: 'Rook'},
    [PieceType.Queen]:  {letter: 'Q', name: 'Queen'},
    [PieceType.King]:   {letter: 'K', name: 'King'},
  },
  colors: {
    [Color.Black]: 'Black',
    [Color.White]: 'White',
  }
}

// export interface Language {
//   pieces: Map<PieceType, PieceTranslation>
//   colors: Map<Color, string>
// }
//
// export const english: Language = {
//   pieces: new Map([
//     [PieceType.Pawn,   {letter: 'P', name: 'Pawn'}],
//     [PieceType.Knight, {letter: 'N', name: 'Knight'}],
//     [PieceType.Bishop, {letter: 'B', name: 'Bishop'}],
//     [PieceType.Rook,   {letter: 'R', name: 'Rook'}],
//     [PieceType.Queen,  {letter: 'Q', name: 'Queen'}],
//     [PieceType.King,   {letter: 'K', name: 'King'}],
//   ]),
//   colors: new Map([
//     [Color.Black, 'Black'],
//     [Color.White, 'White'],
//   ])
// }
