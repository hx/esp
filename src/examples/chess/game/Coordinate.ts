import { Vector } from './Vector'

export enum Coordinate {
  A1, B1, C1, D1, E1, F1, G1, H1,
  A2, B2, C2, D2, E2, F2, G2, H2,
  A3, B3, C3, D3, E3, F3, G3, H3,
  A4, B4, C4, D4, E4, F4, G4, H4,
  A5, B5, C5, D5, E5, F5, G5, H5,
  A6, B6, C6, D6, E6, F6, G6, H6,
  A7, B7, C7, D7, E7, F7, G7, H7,
  A8, B8, C8, D8, E8, F8, G8, H8,
}

export type CoordinateComponent = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

const isCoordinateComponent = (obj: unknown): obj is CoordinateComponent =>
  typeof obj === 'number' && (
    obj === 0 || obj === 1 ||obj === 2 || obj === 3 ||
    obj === 4 || obj === 5 ||obj === 6 || obj === 7
  )

const InvalidCoordinateComponent = new Error('Invalid coordinate component')

export const rank = (coordinate: Coordinate): CoordinateComponent =>
  (coordinate >> 3) as CoordinateComponent

export const file = (coordinate: Coordinate): CoordinateComponent =>
  (coordinate & 0b111) as CoordinateComponent

const A   = 'A'.charCodeAt(0)
const ONE = '1'.charCodeAt(0)

export interface CoordinateInfo {
  file: CoordinateComponent
  rank: CoordinateComponent

  toString(): string
}

export const coordinate = (c: Coordinate): CoordinateInfo => {
  const f = file(c)
  const r = rank(c)
  return {
    file:     f,
    rank:     r,
    toString: () => String.fromCharCode(A + f, ONE + r)
  }
}

export const coordinateFromFileAndRank = (file: number | CoordinateComponent, rank: number | CoordinateComponent): Coordinate => {
  if (!isCoordinateComponent(file) || !isCoordinateComponent(rank)) {
    throw InvalidCoordinateComponent
  }
  return rank << 3 | file
}

export const InvalidCoordinateString = new Error('Invalid coordinate string')

const pattern = /^[a-h][1-8]$/i

export const parseCoordinate = (str: string): Coordinate => {
  if (!pattern.test(str)) {
    throw InvalidCoordinateString
  }
  return coordinateFromFileAndRank(str[0].toUpperCase().charCodeAt(0) - A, str[1].charCodeAt(0) - ONE)
}

export const shiftCoordinate = (coordinate: Coordinate, vector: Vector, distance = 1) =>
  coordinateFromFileAndRank(
    file(coordinate) + vector.file * distance,
    rank(coordinate) + vector.rank * distance
  )

export const maybeShiftCoordinate = (coordinate: Coordinate, vector: Vector, distance = 1) => {
  try {
    return shiftCoordinate(coordinate, vector, distance)
  } catch (e) {
    if (e === InvalidCoordinateComponent) {
      return
    }
    throw e
  }
}
