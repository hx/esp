import React, { FC, useCallback } from 'react'
import { Piece, figurines } from './game/Piece'
import { Coordinate, coordinate } from './game/Coordinate'
import { Color } from './game/Color'
import classNames from 'classnames'

type Notifier = (coord: Coordinate) => void

interface Props {
  coord: Coordinate
  piece?: Piece
  onEnter?: Notifier
  onLeave?: Notifier
  onSelect?: Notifier
  selected: boolean
  highlighted: boolean
  available: boolean
}

export const Square: FC<Props> = ({piece, coord, onEnter, onLeave, onSelect, selected, highlighted, available}) => {
  const figurine = piece && figurines[Color.Black][piece.type]

  const enter = onEnter && useCallback(() => onEnter(coord), [onEnter, coord])
  const leave = onLeave && useCallback(() => onLeave(coord), [onLeave, coord])
  const select = onSelect && useCallback(() => onSelect(coord), [onSelect, coord])

  return (
    <div
      className={classNames('square', {clickable: typeof select === 'function', selected, highlighted, available})}
      onClick={select}
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      {figurine &&
        <span
          className={`figurine color-${piece ? piece.color === Color.Black ? 'black' : 'white' : 'none'}`}
        >
          {figurine}
        </span>}
      <span className="coordinate">{coordinate(coord).toString()}</span>
    </div>
  )
}
