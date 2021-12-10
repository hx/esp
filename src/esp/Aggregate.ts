export type Scalar = string | number | boolean

export type AnyArgs = {[x in string]: Scalar}

export interface EventBase<name extends string = string, Args extends AnyArgs = AnyArgs> {
  name: name
  args: Args
  description?: string
  errors?: string[]
}

export interface Option<T> {
  displayName: string
  value: T
}

interface ArgumentClassBuilder<EventType extends EventBase, Field extends keyof EventType['args']> {
  options(options: Array<Option<EventType['args'][Field]>>): void
}

export interface EventHandlerPayload<T, EventType extends EventBase> {
  event: EventType
  model: T
  reject(reason: string): T
}

export interface EventHandler<T = any, EventType extends EventBase = EventBase> {
  (payload: EventHandlerPayload<T, EventType>): T
}

export interface EventClassBuilder<T, EventType extends EventBase> {
  addArgument: <Field extends keyof EventType['args']>(name: Field, displayName?: string, defaultVal?: EventType['args'][Field]) =>
    ArgumentClassBuilder<EventType, Field>
  getArgument: <Field extends keyof EventType['args']>(name: Field) => EventType['args'][Field] | undefined
  handle: (handler: EventHandler<T, EventType>) => EventClassBuilder<T, EventType>
}

export interface EventClassCreator<T> {
  <EventType extends EventBase>(name: EventType['name'], displayName?: string): EventClassBuilder<T, EventType>
}

export type EventClassesBuilder<T> = (model: T, addEventClass: EventClassCreator<T>) => void

export interface ArgumentClass {
  name: string
  displayName: string
  options?: Option<Scalar>[]
  default?: Scalar
}

export interface EventClass<T = any, EventType extends EventBase = EventBase> {
  name: string
  displayName: string
  arguments: ArgumentClass[]
  handlers: EventHandler<T, EventType>[]
}

export interface Aggregate<T> {
  model: T
  eventClasses: EventClass[]
  hintEvent(event: EventBase): Aggregate<T>
  raiseEvent(event: EventBase): Aggregate<T>
}
