import { Coordinate } from './Coordinate'
import { Piece } from './Piece'
import { Placement } from './Placement'

export type Board = Array<Piece | undefined>

export const emptyBoard = () => Array.from(Array(64)) as Board

export const boardFromPlacement = (placement: Placement): Board => emptyBoard().map((_, i) => placement[i as Coordinate])
