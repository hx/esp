import React, { FC } from 'react'
import { BoardView } from './BoardView'
import { Game } from './game'
import { english } from './game/i18n'
import { describeMove } from './game/Move'

export const GameView: FC<{ projection: Game }> = ({projection}) => {
  const lastMove = projection.playedMoves[projection.playedMoves.length - 1]
  const position = projection.positions[projection.positions.length - 1]
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
