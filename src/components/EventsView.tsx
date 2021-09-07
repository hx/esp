import React, { FC, useCallback, useMemo, useState } from 'react'
import { EventBase } from '../esp'
import { EventView } from './EventView'

type UndoFunc = (steps: number) => void

interface Props {
  events: EventBase[],
  undone: EventBase[],
  undo: UndoFunc
  redo: UndoFunc
}

export const EventsView: FC<Props> = ({events, undone, undo, redo}) => {
  const [eventCount, setEventCount] = useState<number | null>(null)

  const undoTo = useMemo(() => (index: number) => {
    const eventsToUndo = events.length - index
    if (eventsToUndo > 0) {
      undo(eventsToUndo)
    } else if (eventsToUndo < 0) {
      redo(-eventsToUndo)
    }
  }, [events, undo, redo])

  const enter = useCallback(index => {
    if (eventCount === null) {
      setEventCount(events.length)
    }
    undoTo(index)
  }, [undoTo, events, eventCount])

  const leave = useCallback(() => {
    if (typeof eventCount === 'number') {
      setEventCount(null)
      undoTo(eventCount)
    }
  }, [undoTo, eventCount])

  const eventsLength = events.length

  return (
    <div className="event-list" onMouseLeave={leave}>
      {events.map((event, eventIndex) =>
        <EventView key={eventIndex} index={eventIndex} event={event} onEnter={enter}/>)}
      {undone.map((event, eventIndex) =>
        <EventView key={eventIndex} index={eventsLength + eventIndex} event={event} onEnter={enter} muted/>)}
    </div>
  )
}
