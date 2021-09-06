import React, { FC, useMemo } from 'react'
import { EventBase } from '../esp'

type Pairs = Array<[string, unknown]>

export const EventView: FC<{ event: EventBase, index: number }> = ({event, index}) => {
  const eventPairs: Pairs = useMemo(
    () => Object.keys(event).filter(k => k !== 'name').map(k => [k, event[k]]),
    [event]
  )

  return (
    <div className="event">
      <span className="index badge bg-light text-secondary">{index + 1}</span>{' '}
      <span className="event-name badge bg-primary">{event.name}</span>
      <div className="arguments d-inline">
        <EventPairs pairs={eventPairs}/>
      </div>
    </div>
  )
}

const EventPairs: FC<{ pairs: Pairs }> = ({pairs}) => (
  <>
    {pairs.map(([name, value]) =>
      <React.Fragment key={name}>
        <span className="badge bg-secondary mx-2">{name}</span>
        <span className="small mx-2">{String(value)}</span>
      </React.Fragment>
    )}
  </>
)
