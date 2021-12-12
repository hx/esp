import React, { FC, useCallback, useMemo, useState } from 'react'
import { Aggregate, EventBase } from '../esp'
import { replaceAtIndex } from '../utilities'
import { EventClassesView } from './EventClassesView'
import { EventsView } from './EventsView'

export type View<T> = FC<{ projection: T }>

interface Props<T> {
  aggregate: Aggregate<T>
  view: View<T>
}

export const App = <T extends unknown>({aggregate: initialAggregate, view: View}: Props<T>) => {
  const [aggregates, setAggregates] = useState([initialAggregate])
  const [events, setEvents]         = useState<EventBase[]>([])
  const [undone, setUndone]         = useState<EventBase[]>([])
  const [errors, setErrors]         = useState<Record<string, string[]>>({})
  const aggregate                   = useMemo(() => aggregates[events.length], [aggregates, events])

  const onEvent = useCallback((event: EventBase) => {
    const newAggregate = aggregate.applyEvent(event)
    if (event.errors) {
      setErrors({[event.name]: event.errors})
      return
    }
    setErrors({})
    setAggregates([...aggregates.slice(0, events.length+1), newAggregate])
    setEvents([...events, event])
    setUndone([])
  }, [aggregate, events])

  const onHint = useCallback((event: EventBase) => {
    const newAggregate = aggregate.hintEvent(event)
    setAggregates(replaceAtIndex(aggregates, aggregates.length-1, newAggregate))
  }, [aggregate])

  const {projection, eventClasses} = aggregate

  const undo = useCallback((steps = 1) => {
    const remaining = events.slice(0, -steps)
    const undone    = events.slice(-steps)
    setErrors({})
    setEvents(remaining)
    setUndone(others => [...undone, ...others])
  }, [events])

  const redo = useCallback((steps = 1) => {
    const redone = undone.slice(0, steps)
    const remaining = undone.slice(steps)
    setErrors({})
    setEvents([...events, ...redone])
    setUndone(remaining)
  }, [undone, events])

  return (
    <div className="container-fluid">
      <div className="masthead row">
        <h1>Event source model prototyping.</h1>
      </div>
      <div className="row">
        <div className="left col-6">
          <EventsView events={events} undone={undone} undo={undo} redo={redo}/>
          <EventClassesView
            errors={errors}
            classes={eventClasses}
            key={events.length}
            onEvent={onEvent}
            onHint={onHint}
            undo={events[0] && undo}
            redo={undone[0] && redo}
          />
        </div>
        <div className="right col-6">
          <View projection={projection}/>
        </div>
      </div>
    </div>
  )
}
