import { coordinate, Coordinate, file, rank } from './Coordinate'

describe('Coordinates', () => {
  it('has a sane enum', () => {
    expect(Coordinate.A1).toBe(0)
    expect(Coordinate.A2).toBe(8)
    expect(Coordinate.H8).toBe(63)
  })

  describe(rank, () => {
    it('returns numeric rank', () => {
      expect(rank(Coordinate.A1)).toBe(0)
      expect(rank(Coordinate.A8)).toBe(7)
    })
  })

  describe(file, () => {
    it('returns numeric file', () => {
      expect(file(Coordinate.A1)).toBe(0)
      expect(file(Coordinate.H1)).toBe(7)
    })
  })

  describe(coordinate, () => {
    it('returns coordinate info', () => {
      const info = coordinate(Coordinate.B6)
      expect(info.file).toBe(1)
      expect(info.rank).toBe(5)
      expect(`${info}`).toBe('B6')
    })
  })
})
