import { Coordinate } from './Coordinate'
import { Piece } from './Piece'

export type Placement = Partial<Record<Coordinate, Piece>>
