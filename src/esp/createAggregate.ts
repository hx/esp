import { mapToObj } from '../utilities'
import { Aggregate } from './Aggregate'
import { EventClass } from './EventClass'
import { EventBase } from './EventBase'
import { EventClassCreator } from './EventClassCreator'
import { Applicator } from './Applicator'
import { ArgumentClass } from './ArgumentClass'
import { Option } from './Option'
import { AnyArgs } from './types'
import { EventClassBuilder } from './EventClassBuilder'
import { EventHandler } from './EventHandler'

interface State<T> {
  projection: T
  eventHints: Record<string, AnyArgs>
  eventClasses: EventClass[]
  applicator: Applicator<T>
}

const addEventToState = <T>(state: State<T>, event: EventBase): State<T> => ({
  ...state,
  eventHints: {
    ...state.eventHints,
    [event.name]: {...state.eventHints[event.name], ...event.args}
  }
})

const applyEvent = <T>(state: State<T>, event: EventBase): Aggregate<T> => {
  const newState = {...state, eventHints: {}}
  const errors: string[] = []
  const reject = (reason: string) => {
    errors.push(reason)
    event.errors = errors
    return state.projection
  }
  delete event.errors
  state
    .eventClasses
    .find(c => c.name === event.name)
    ?.handlers
    ?.forEach(h => newState.projection = h({event, reject, projection: newState.projection}))
  return makeAggregateFromState(errors.length === 0 ? newState : state)
}

const hintEvent = <T>(state: State<T>, event: EventBase): Aggregate<T> =>
  makeAggregateFromState(addEventToState(state, event))

const DuplicateEventClassName = new Error('Duplicate event class name')

const createEventClassCreator = <T>(state: State<T>, eventClasses: EventClass<T>[]): EventClassCreator<T> =>
  <EventType extends EventBase>(name: EventType['name'], displayName = name) => {
    if (eventClasses.find(e => e.name === name)) {
      throw DuplicateEventClassName
    }
    const eventClass: EventClass = {
      name, displayName,
      arguments: [],
      handlers: []
    }
    eventClasses.push(eventClass)
    const ret: EventClassBuilder<T, EventType> = {
      addArgument<Field extends keyof EventType['args']>(name: Field, displayName = String(name), defaultVal?: EventType['args'][Field]) {
        const args: ArgumentClass = {name: String(name), displayName, default: defaultVal}
        eventClass.arguments.push(args)

        return {
          options(options: Array<Option<EventType['args'][Field]>>) {
            args.options = options
          }
        }
      },
      getArgument: <Field extends keyof EventType['args']>(n: Field) => {
        let result: unknown = state.eventHints[name]?.[n as string]
        if (result === undefined) {
          const argumentClass = eventClass.arguments.find(a => a.name === n)
          if (argumentClass) {
            result = argumentClass.default
            if (result === undefined) {
              result = argumentClass.options?.[0]?.value
            }
          }
        }
        return result as EventType['args'][Field] | undefined
      },
      handle: (handler: EventHandler<T, EventType>) => {
        eventClass.handlers.push(handler as EventHandler)
        return ret
      }
    }
    return ret
  }

const buildEventClasses = <T>(state: State<T>): EventClass[] => {
  const result: EventClass[] = []
  state.applicator(state.projection, createEventClassCreator(state, result))
  return result
}

export const createAggregate = <T>(seedState: T, applicator: Applicator<T>): Aggregate<T> =>
  makeAggregateFromState({
    projection: seedState,
    eventHints:          {},
    eventClasses:        [],
    applicator
  })

const makeAggregateFromState = <T>(state: State<T>): Aggregate<T> => {
  const eventClasses = buildEventClasses(state)
  const eventHints = Object.keys(state.eventHints).length === 0 ? makeEventHints(eventClasses) : state.eventHints
  state            = {...state, eventClasses, eventHints}
  return {
    projection:        state.projection,
    eventClasses: state.eventClasses,
    hintEvent:    e => hintEvent(state, e),
    applyEvent:   e => applyEvent(state, e)
  }
}

const makeEventHints = (classes: EventClass[]) =>
  mapToObj(
    classes,
    c => [
      c.name,
      mapToObj(
        c.arguments.filter(a => a.options?.[0]),
        arg => [arg.name, arg.options![0].value]
      )
    ]
  )
