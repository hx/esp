import React, { FC } from 'react'
import { Game } from './game'
import { Color } from './game/Color'
import { coordinate, coordinateFromFileAndRank } from './game/Coordinate'
import { english } from './game/i18n'
import { describeMove } from './game/Move'
import { figurines } from './game/Piece'
import { Placement } from './game/Placement'

export const GameView: FC<{ model: Game }> = ({model}) => {
  const lastMove = model.playedMoves[model.playedMoves.length - 1]
  const position = model.positions[model.positions.length - 1]
  return (
    <div>
      <BoardView placement={position.placement}/>
      <div className="card my-3">
        <div className="card-body">
          <div className="card-title">
            <h5>Next player</h5>
          </div>
          <div className="card-text">
            {english.colors[position.nextPlayer]}
          </div>
        </div>
        {lastMove &&
        <div className="card-body pt-1">
          <div className="card-title">
            <h5>Last move</h5>
          </div>
          <div className="card-text">
            {describeMove(lastMove)}
          </div>
        </div>}
      </div>
    </div>
  )
}

const FILES = [0, 1, 2, 3, 4, 5, 6, 7]
const RANKS = [...FILES].reverse()

const BoardView: FC<{ placement: Placement }> = ({placement}) => {
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
