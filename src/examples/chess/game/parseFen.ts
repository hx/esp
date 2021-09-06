import { mapToObj } from '../../../utilities'
import { CastlingAvailability } from './CastlingAvailability'
import { Color, Colors } from './Color'
import { Coordinate, coordinateFromFileAndRank, parseCoordinate } from './Coordinate'
import { Language, english } from './i18n'
import { Piece, letter } from './Piece'
import { PieceTypes } from './PieceType'
import { Placement } from './Placement'
import { Position } from './Position'

const InvalidRecord = new Error('invalid record')

const [A, H, a, h, ZERO, ONE, EIGHT] = ['A', 'H', 'a', 'h', '0', '1', '8'].map(c => c.charCodeAt(0))

const parseCastlingAvailability = (str: string): CastlingAvailability => {
  if (str === '-') {
    return {}
  }
  if (str === '' || str.length > 4) {
    throw InvalidRecord
  }
  const result: CastlingAvailability = {}
  for (const char of str) {
    const num = char.charCodeAt(0)
    switch (true) {
    case char === 'K': result[Coordinate.H1] = true; break
    case char === 'Q': result[Coordinate.A1] = true; break
    case char === 'k': result[Coordinate.H8] = true; break
    case char === 'q': result[Coordinate.A8] = true; break
    case num >= A && num <= H: result[coordinateFromFileAndRank(num-A, 0)] = true; break
    case num >= a && num <= h: result[coordinateFromFileAndRank(num-a, 7)] = true; break
    default:
      throw InvalidRecord
    }
  }
  return result
}

const pieceMap = (language: Language): Record<string, Piece> =>
  mapToObj(Colors.flatMap(color => PieceTypes.map(type => ({color, type}))), p => [letter(p, language), p])

const parsePlacement = (str: string, language: Language = english): Placement => {
  const ranks = str.split('/', 9).reverse()
  if (ranks.length !== 8) {
    throw InvalidRecord
  }
  const result: Placement = {}
  const map               = pieceMap(language)
  for (let rank = 0; rank <= 7; rank++) {
    let file = 0
    for (const char of ranks[rank]) {
      const piece = map[char]
      const num   = char.charCodeAt(0)
      if (piece) {
        result[coordinateFromFileAndRank(file, rank)] = piece
        file++
      } else if (num >= ONE && num <= EIGHT) {
        file += num - ZERO
      } else {
        throw InvalidRecord
      }
    }
    if (file !== 8) {
      throw InvalidRecord
    }
  }
  return result
}

const parseNextPlayer = (str: string): Color => {
  switch (str) {
  case 'w':
  case 'W':
    return Color.White
  case 'b':
  case 'B':
    return Color.Black
  default:
    throw InvalidRecord
  }
}

const numPattern = /^\d+$/

const parseMoves = (str: string): number => {
  if (!numPattern.test(str)) {
    throw InvalidRecord
  }
  return +str
}

export const parseFen = (str: string, language: Language = english): Position => {
  const fields = str.split(' ', 7)

  return {
    placement: parsePlacement(fields[0], language),
    nextPlayer: parseNextPlayer(fields[1]),
    castlingAvailability: parseCastlingAvailability(fields[2]),
    enPassantTarget: fields[3] === '-' ? 0 : parseCoordinate(fields[3]),
    halfMoves: parseMoves(fields[4]),
    fullMoves: parseMoves(fields[5]) - 1
  }
}

export const startingPosition = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
