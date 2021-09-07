import { mapToObj } from '../utilities'
import {
  AnyArgs,
  ArgumentClass,
  Builder,
  BuilderMethods,
  EventBase,
  EventClass,
  EventClassBuilder,
  EventClassCreator,
  EventClassesBuilder,
  EventHandler,
  Option
} from './Builder'

interface BuilderState<T> {
  model: T
  eventHints: Record<string, AnyArgs>
  eventClasses: EventClass[]
  eventClassesBuilder: EventClassesBuilder<T>
}

const addEventToState = <T>(state: BuilderState<T>, event: EventBase): BuilderState<T> => ({
  ...state,
  eventHints: {
    ...state.eventHints,
    [event.name]: {...state.eventHints[event.name], ...event.args}
  }
})

const raiseEvent = <T>(state: BuilderState<T>, event: EventBase): Builder<T> => {
  const newState = {...state, eventHints: {}}
  const errors: string[] = []
  const reject = (reason: string) => {
    errors.push(reason)
    event.errors = errors
    return state.model
  }
  delete event.errors
  state.eventClasses
    .find(c => c.name === event.name)?.handlers
    ?.forEach(h => newState.model = h({event, reject, model: newState.model}))
  return makeBuilderFromState(errors.length === 0 ? newState : state)
}

const hintEvent = <T>(state: BuilderState<T>, event: EventBase): Builder<T> =>
  makeBuilderFromState(addEventToState(state, event))

const DuplicateEventClassName = new Error('Duplicate event class name')

const createEventClassCreator = <T>(state: BuilderState<T>, eventClasses: EventClass<T>[]): EventClassCreator<T> =>
  <EventType extends EventBase>(name: EventType['name'], displayName = name) => {
    if (eventClasses.find(e => e.name === name)) {
      throw DuplicateEventClassName
    }
    const eventClass: EventClass = {
      name, displayName,
      arguments: [],
      handlers:  []
    }
    eventClasses.push(eventClass)
    const ret: EventClassBuilder<T, EventType> = {
      addArgument<Field extends keyof EventType['args']>(name: Field, displayName = String(name)) {
        const args: ArgumentClass = {name: String(name), displayName}
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
          result = eventClass.arguments.find(a => a.name === n)?.options?.[0]?.value
        }
        return result as EventType['args'][Field]
      },
      handle: (handler: EventHandler<T, EventType>) => {
        eventClass.handlers.push(handler as EventHandler)
        return ret
      }
    }
    return ret
  }

const buildEventClasses = <T>(state: BuilderState<T>): EventClass[] => {
  const result: EventClass[] = []
  state.eventClassesBuilder(state.model, createEventClassCreator(state, result))
  return result
}

export const createBuilder = <T>(props: BuilderMethods<T>): Builder<T> =>
  makeBuilderFromState({
    model:               props.seed(),
    eventHints:          {},
    eventClasses:        [],
    eventClassesBuilder: props.eventClasses
  })

const makeBuilderFromState = <T>(state: BuilderState<T>): Builder<T> => {
  const eventClasses = buildEventClasses(state)
  const eventHints = Object.keys(state.eventHints).length === 0 ? makeEventHints(eventClasses) : state.eventHints
  state            = {...state, eventClasses, eventHints}
  return {
    model:        state.model,
    eventClasses: state.eventClasses,
    hintEvent:    e => hintEvent(state, e),
    raiseEvent:   e => raiseEvent(state, e)
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
