import React, { FC } from 'react'
import { Color } from './game/Color'
import { coordinate, coordinateFromFileAndRank } from './game/Coordinate'
import { figurines } from './game/Piece'
import { Placement } from './game/Placement'

const FILES = [0, 1, 2, 3, 4, 5, 6, 7]
const RANKS = [...FILES].reverse()

export const BoardView: FC<{ placement: Placement }> = ({placement}) => {
  return (
    <div className="chess-board">
      <div className="chess-board-inner">
        {RANKS.map(rank =>
          <div className="rank" key={rank}>
            {FILES.map(file => {
              const coord    = coordinateFromFileAndRank(file, rank)
              const piece    = placement[coord]
              const figurine = piece && figurines[Color.Black][piece.type]

              return (
                <div className="square" key={file}>
                  {figurine &&
                  <span
                    className={`figurine color-${piece ? piece.color === Color.Black ? 'black' : 'white' : 'none'}`}
                  >
                    {figurine}
                  </span>}
                  <span className="coordinate">{coordinate(coord).toString()}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
