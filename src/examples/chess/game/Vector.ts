import { Coordinate, file, rank } from './Coordinate'

export interface Vector {
  file: number
  rank: number
}

export const vector = (from: Coordinate, to: Coordinate): Vector => ({
  file: file(to) - file(from),
  rank: rank(to) - rank(from)
})

export const vectors = (from: Coordinate, to: Coordinate[]) => to.map(t => vector(from, t))
