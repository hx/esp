import React, { FC, useCallback, useMemo, useState } from 'react'
import { Builder, EventBase } from '../esp'
import { replaceAtIndex } from '../utilities'
import { EventClassesView } from './EventClassesView'
import { EventsView } from './EventsView'

export type View<T> = FC<{ model: T }>

interface Props<T> {
  builder: Builder<T>
  view: View<T>
}

export const App = <T extends unknown>({builder: initialBuilder, view: View}: Props<T>) => {
  const [builders, setBuilders] = useState([initialBuilder])
  const [events, setEvents]     = useState<EventBase[]>([])
  const [undone, setUndone]     = useState<EventBase[]>([])
  const [errors, setErrors]     = useState<Record<string, string[]>>({})
  const builder                 = useMemo(() => builders[events.length], [builders, events])

  const onEvent = useCallback((event: EventBase) => {
    const newBuilder = builder.raiseEvent(event)
    if (event.errors) {
      setErrors({[event.name]: event.errors})
      return
    }
    setErrors({})
    setBuilders([...builders.slice(0, events.length+1), newBuilder])
    setEvents([...events, event])
    setUndone([])
  }, [builder, events])

  const onHint = useCallback((event: EventBase) => {
    const newBuilder = builder.hintEvent(event)
    setBuilders(replaceAtIndex(builders, builders.length-1, newBuilder))
  }, [builder])

  const {model, eventClasses} = builder

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
          <EventsView events={events} undone={undone}/>
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
          <View model={model}/>
        </div>
      </div>
    </div>
  )
}
