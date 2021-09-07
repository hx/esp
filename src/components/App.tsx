import React, { FC, useCallback, useState } from 'react'
import { Builder, EventBase } from '../esp'
import { EventClassesView } from './EventClassesView'
import { EventsView } from './EventsView'

export type View<T> = FC<{ model: T }>

interface Props<T> {
  builder: Builder<T>
  view: View<T>
}

export const App = <T extends unknown>({builder: initialBuilder, view: View}: Props<T>) => {
  const [builder, setBuilder] = useState(initialBuilder)
  const [events, setEvents]   = useState<EventBase[]>([])
  const [errors, setErrors]   = useState<Record<string, string[]>>({})

  const onEvent = useCallback((event: EventBase) => {
    const newBuilder = builder.raiseEvent(event)
    if (event.errors) {
      setErrors({[event.name]: event.errors})
      return
    }
    setErrors({})
    setBuilder(newBuilder)
    setEvents([...events, event])
  }, [builder, events])

  const onHint = useCallback((event: EventBase) => {
    const newBuilder = builder.hintEvent(event)
    setBuilder(newBuilder)
  }, [builder])

  const {model, eventClasses} = builder

  const undo = useCallback((steps = 1) => {
    const newEvents = events.slice(0, -steps)
    let builder = initialBuilder
    newEvents.forEach(e => builder = builder.raiseEvent(e))
    setEvents(newEvents)
    setBuilder(builder)
    setErrors({})
  }, [initialBuilder, events])

  return (
    <div className="container-fluid">
      <div className="masthead row">
        <h1>Event source model prototyping</h1>
      </div>
      <div className="row">
        <div className="left col-6">
          <EventsView events={events}/>
          <EventClassesView
            errors={errors}
            classes={eventClasses}
            key={events.length}
            onEvent={onEvent}
            onHint={onHint}
            undo={events[0] && undo}
          />
        </div>
        <div className="right col-6">
          <View model={model}/>
        </div>
      </div>
    </div>
  )
}
