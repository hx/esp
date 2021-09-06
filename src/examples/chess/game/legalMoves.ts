import { Board, boardFromPlacement } from './Board'
import { Color } from './Color'
import {
  Coordinate,
  CoordinateComponent,
  coordinateFromFileAndRank,
  file,
  maybeShiftCoordinate,
  rank
} from './Coordinate'
import { Move, moveIsPromotion } from './Move'
import { PieceType } from './PieceType'
import { Position, applyMoveToPosition } from './Position'
import { Vector, vectors } from './Vector'

const c = Coordinate

const ROOK_VECTORS   = vectors(c.C3, [c.C4, c.D3, c.C2, c.B3])
const BISHOP_VECTORS = vectors(c.C3, [c.D4, c.D2, c.B2, c.B4])
const KNIGHT_VECTORS = vectors(c.C3, [c.D5, c.E4, c.E2, c.D1, c.B1, c.A2, c.A4, c.B5])
const ROYAL_VECTORS  = vectors(c.C3, [c.C4, c.D4, c.D3, c.D2, c.C2, c.B2, c.B3, c.B4])

const KingMissing = new Error('King is missing')

interface ScanArguments {
  board: Board
  from: Coordinate
  vectors: Vector[]
  limit?: number
  excludeCaptures?: boolean
  onlyCaptures?: boolean
  enPassantTarget?: Coordinate
}

const scan = ({board, limit, vectors, from, excludeCaptures, onlyCaptures, enPassantTarget}: ScanArguments): Coordinate[] => {
  limit = limit || 7
  const movingPiece = board[from]
  if (!movingPiece) {
    throw new Error('no piece on "from" square')
  }
  const result: Coordinate[] = []
  for (const vector of vectors) {
    for (let distance = 1; distance <= limit; distance++) {
      const to = maybeShiftCoordinate(from, vector, distance)
      if (to === undefined) {
        continue // TODO: pretty sure this should be a break
      }
      const targetPiece = board[to]
      if (targetPiece) {
        if (!excludeCaptures && movingPiece.color !== targetPiece.color) {
          result.push(to)
        }
        break
      } else if (to === enPassantTarget) {
        result.push(to)
      }
      if (!onlyCaptures) {
        result.push(to)
      }
    }
  }
  return result
}

const PawnHomeRanks: Record<Color, CoordinateComponent> = {
  [Color.White]: 1,
  [Color.Black]: 6
}

const PawnAdvanceDirections: Record<Color, 1 | -1> = {
  [Color.White]: 1,
  [Color.Black]: -1
}

interface CastlingSide {
  path: number[]
  rookFile: CoordinateComponent
}

export const castlingSides: CastlingSide[] = [
  {path: [5, 6], rookFile: 7},
  {path: [3, 2, 1], rookFile: 0}
]

interface ReachableArguments {
  board: Board
  from: Coordinate
  excludeCastling?: boolean
  position: Position
  isCheck: boolean
}

export const isAttacked = (position: Position, target: Coordinate, byColor: Color, board = boardFromPlacement(position.placement)): boolean =>
  board.some(
    (piece, from) =>
      piece?.color === byColor &&
      reachable({board, position, from: from as CoordinateComponent, excludeCastling: true, isCheck: false})
        .indexOf(target) !== -1
  )

const reachableByCastling = ({board, from, position, isCheck}: ReachableArguments): Coordinate[] => {
  if (isCheck || file(from) !== 4) {
    return []
  }
  const r = rank(from)
  const result: Coordinate[] = []
  const king = board[from]
  if (!king) {
    throw KingMissing
  }
  for (const opt of castlingSides) {
    if (!position.castlingAvailability[coordinateFromFileAndRank(opt.rookFile, r)]) {
      continue
    }
    if (opt.path.some(f => board[coordinateFromFileAndRank(f, r)] !== undefined)) {
      continue
    }
    if (isAttacked(position, coordinateFromFileAndRank(opt.path[0], r), 1-king.color)) {
      continue
    }
    result.push(coordinateFromFileAndRank(opt.path[1], r))
  }
  return result
}

const reachable = (args: ReachableArguments): Coordinate[] => {
  const {board, from, position: {enPassantTarget}, excludeCastling} = args
  const piece = board[from]
  if (piece === undefined) {
    return []
  }
  switch (piece.type) {
  case PieceType.Pawn: {
    const home = PawnHomeRanks[piece.color]
    const dir = PawnAdvanceDirections[piece.color]
    const limit = rank(from) === home ? 2 : 1
    return [
      ...scan({board, from, enPassantTarget, limit, vectors: [{file: 0, rank: dir}], excludeCaptures: true}),
      ...scan({
        board,
        from,
        enPassantTarget,
        limit:        1,
        vectors:      [{file: 1, rank: dir}, {file: -1, rank: dir}],
        onlyCaptures: true
      })
    ]
  }
  case PieceType.Knight: return scan({board, from, vectors: KNIGHT_VECTORS, limit: 1})
  case PieceType.Bishop: return scan({board, from, vectors: BISHOP_VECTORS})
  case PieceType.Rook:   return scan({board, from, vectors: ROOK_VECTORS})
  case PieceType.Queen:  return scan({board, from, vectors: ROYAL_VECTORS})
  case PieceType.King: {
    const result = scan({board, from, vectors: ROYAL_VECTORS, limit: 1})
    return excludeCastling ? result : [...result, ...reachableByCastling(args)]
  }
  }
}

export const findKing = (board: Board, color: Color): Coordinate => {
  const result = board.findIndex(p => p?.color === color && p.type === PieceType.King)
  if (!result) {
    throw KingMissing
  }
  return result as Coordinate
}

export const isCheck = (position: Position, board = boardFromPlacement(position.placement)) =>
  isAttacked(position, findKing(board, position.nextPlayer), 1 - position.nextPlayer, board)

export const legalMoves = (position: Position): Move[] => {
  const board  = boardFromPlacement(position.placement)
  const player = position.nextPlayer
  const result: Move[] = []
  const check = isCheck(position)

  for (let from: Coordinate = 0; from < 64; from++) {
    const piece = board[from]
    if (piece === undefined || piece.color !== player) {
      continue
    }
    for (const to of reachable({position, board, from, isCheck: check})) {
      const move: Move = {
        from, to, piece,
        capturedPiece: board[to],
        isCheck:       false,
        isEnPassant:   false
      }
      if (move.piece.type === PieceType.Pawn && file(from) !== file(to) && !board[to]) {
        move.capturedPiece = board[coordinateFromFileAndRank(file(to), rank(from))]
        move.isEnPassant   = true
      }
      const candidates: Move[] = []
      if (moveIsPromotion(move)) {
        candidates.push(
          ...[PieceType.Queen, PieceType.Knight, PieceType.Rook, PieceType.Bishop]
            .map(t => ({
              ...move,
              promoteTo: t
            }))
        )
      } else {
        candidates.push(move)
      }
      for (const candidate of candidates) {
        const lookahead = applyMoveToPosition(candidate, position)
        const lookaheadBoard = boardFromPlacement(lookahead.placement)

        if (isAttacked(lookahead, findKing(lookaheadBoard, position.nextPlayer), lookahead.nextPlayer, lookaheadBoard)) {
          continue
        }

        candidate.isCheck = isCheck(lookahead, lookaheadBoard)
        result.push(candidate)
      }
    }
  }

  return result
}
