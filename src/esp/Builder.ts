export type AnyArgs = {[x in string]: string | number}

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
  addArgument: <Field extends keyof EventType['args']>(name: Field, displayName?: string) =>
    ArgumentClassBuilder<EventType, Field>
  getArgument: <Field extends keyof EventType['args']>(name: Field) => EventType['args'][Field] | undefined
  handle: (handler: EventHandler<T, EventType>) => EventClassBuilder<T, EventType>
}

export interface EventClassCreator<T> {
  <EventType extends EventBase>(name: EventType['name'], displayName?: string): EventClassBuilder<T, EventType>
}

export type EventClassesBuilder<T> = (model: T, addEventClass: EventClassCreator<T>) => void

export interface BuilderMethods<T> {
  seed: () => T
  eventClasses: EventClassesBuilder<T>
}

export interface ArgumentClass {
  name: string
  displayName: string
  options?: Option<string | number>[]
}

export interface EventClass<T = any, EventType extends EventBase = EventBase> {
  name: string
  displayName: string
  arguments: ArgumentClass[]
  handlers: EventHandler<T, EventType>[]
}

export interface Builder<T> {
  model: T
  eventClasses: EventClass[]
  hintEvent(event: EventBase): Builder<T>
  raiseEvent(event: EventBase): Builder<T>
}
