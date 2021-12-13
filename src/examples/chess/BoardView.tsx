import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Coordinate, coordinateFromFileAndRank, rank } from './game/Coordinate'
import { Position } from './game/Position'
import { legalMoves } from './game/legalMoves'
import { Square } from './Square'
import { ApplyEvent } from '../../components'
import { Game, PieceType } from './game'
import { MoveEvent } from './aggregate'

const FILES = [0, 1, 2, 3, 4, 5, 6, 7]
const RANKS = [...FILES].reverse()

export const BoardView: FC<{ position: Position, applyEvent: ApplyEvent<Game> }> = ({position, applyEvent}) => {
  const {placement} = position

  const legal = useMemo(() => {
    const result = new Map<Coordinate, Set<Coordinate>>()
    for (const move of legalMoves(position)) {
      const set = result.get(move.from)
      if (set) {
        set.add(move.to)
      } else {
        result.set(move.from, new Set([move.to]))
      }
    }
    return result
  }, [position])

  const [selectedCoord, setSelectedCoord] = useState<Coordinate | null>(null)
  const [highlightedCoord, setHighlightedCoord] = useState<Coordinate | null>(null)

  useEffect(() => {
    setHighlightedCoord(null)
    setSelectedCoord(null)
  }, [position])

  const onSelect = useCallback((coord: Coordinate) => {
    if (selectedCoord === null) {
      setSelectedCoord(coord)
    } else if (selectedCoord === coord) {
      setSelectedCoord(null)
    } else if (legal.has(coord)) {
      setSelectedCoord(coord)
    } else {
      const event: MoveEvent = {
        name: 'move',
        args: {
          from: selectedCoord,
          to:   coord,
          promoteTo:
                position.placement[coord]?.type === PieceType.Pawn && (rank(coord) === 0 || rank(coord) === 7) ?
                  PieceType.Queen :
                  undefined
        }
      }
      applyEvent(event)
    }
  }, [selectedCoord])

  const onEnter = useCallback((coord: Coordinate) => {
    setHighlightedCoord(coord)
  }, [])

  const onLeave = useCallback((coord: Coordinate) => {
    if (highlightedCoord === coord) {
      setHighlightedCoord(null)
    }
  }, [highlightedCoord])

  return (
    <div className="chess-board">
      <div className="chess-board-inner">
        {RANKS.map(rank =>
          <div className="rank" key={rank}>
            {FILES.map(file => {
              const coord = coordinateFromFileAndRank(file, rank)
              const canMove = typeof legal.get(coord) === 'object'
              const clickable = canMove || (selectedCoord && legal.get(selectedCoord)?.has(coord)) || false
              return <Square
                key={file}
                coord={coord}
                piece={placement[coord]}
                onEnter={clickable ? onEnter : undefined}
                onLeave={clickable ? onLeave : undefined}
                onSelect={clickable ? onSelect : undefined}
                available={
                  selectedCoord === null ? highlightedCoord === null ?
                    false :
                    legal.get(highlightedCoord)?.has(coord) || false :
                    legal.get(selectedCoord)?.has(coord) || false
                }
                highlighted={highlightedCoord === coord}
                selected={selectedCoord === coord}
              />
            })}
          </div>
        )}
      </div>
    </div>
  )
}
