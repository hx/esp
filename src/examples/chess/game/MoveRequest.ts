import { Coordinate } from './Coordinate'
import { PieceType } from './PieceType'

export interface MoveRequest {
  from: Coordinate
  to: Coordinate
  promoteTo?: PieceType
}
