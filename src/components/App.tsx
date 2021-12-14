import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Aggregate, EventBase } from '../esp'
import { replaceAtIndex } from '../utilities'
import { EventClassesView } from './EventClassesView'
import { EventsView } from './EventsView'
import { View } from './View'
import { SavedState } from '../persistence'
import { AppCallbacks } from './AppCallbacks'

interface Props<T> {
  aggregate: Aggregate<T>
  view: View<T>
  onChange?: (state: SavedState) => void
  initialState?: SavedState
  title?: string
}

export const App = <T extends unknown>({aggregate: initialAggregate, view: View, onChange, initialState, title}: Props<T>) => {
  const initialAggregates = [initialAggregate]
  const initialEvents = initialAggregate.history.slice()
  const initialUndone: EventBase[] = []

  const [loaded, setLoaded] = useState(false)
  if (!loaded && initialState) {
    setLoaded(true)
    const {history, undoneCount} = initialState
    const notUndoneCount = history.length - undoneCount
    for (const event of history) {
      const {aggregate} = initialAggregates[initialAggregates.length - 1].applyEvent(event)
      if (!aggregate) {
        break
      }
      initialAggregates.push(aggregate)
      if (initialEvents.length < notUndoneCount) {
        initialEvents.push(event)
      } else {
        initialUndone.push(event)
      }
    }
  }

  const [aggregates, setAggregates] = useState(initialAggregates)
  const [events, setEvents]         = useState(initialEvents)
  const [undone, setUndone]         = useState(initialUndone)
  const [errors, setErrors]         = useState<Record<string, string[]>>({})
  const aggregate                   = useMemo(() => aggregates[events.length], [aggregates, events])

  useEffect(() => onChange?.({
    history:     [...events, ...undone],
    undoneCount: undone.length
  }), [events, undone])

  const onEvent = useCallback((event: EventBase) => {
    const result = aggregate.applyEvent(event)
    const {aggregate: newAggregate, errors} = result
    if (errors) {
      setErrors({[event.name]: errors})
    }
    else if (newAggregate) {
      setErrors({})
      setAggregates([...aggregates.slice(0, events.length+1), newAggregate])
      setEvents([...events, event])
      setUndone([])
    }
    return result
  }, [aggregate, events])

  const onHint = useCallback((event: EventBase) => {
    const newAggregate = aggregate.hintEvent(event)
    setAggregates(replaceAtIndex(aggregates, aggregates.length-1, newAggregate))
  }, [aggregate])

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

  const reset = useCallback(() => {
    setErrors({})
    setEvents([])
    setUndone([])
    setAggregates([initialAggregate])
  }, [initialAggregate])

  const appCallbacks: AppCallbacks = {
    undo: events[0] && undo,
    redo: undone[0] && redo,
    reset: (events[0] || undone[0]) && reset
  }

  return (
    <div className="container-fluid">
      <div className="masthead row py-2 bg-black text-white">
        <div className="col-6 text-muted">
          Event Source Prototyping
        </div>
        <div className="col-6 fw-bold">
          {title || 'Untitled View'}
        </div>
      </div>
      <div className="row">
        <div className="left col-6">
          <EventsView events={events} undone={undone} undo={undo} redo={redo}/>
          <EventClassesView
            errors={errors}
            classes={aggregate.eventClasses}
            key={events.length}
            onEvent={onEvent}
            onHint={onHint}
            appCallbacks={appCallbacks}
          />
        </div>
        <div className="right col-6">
          <View aggregate={aggregate} applyEvent={onEvent}/>
        </div>
      </div>
    </div>
  )
}
