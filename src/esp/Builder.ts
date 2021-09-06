export type EventBase = {[x in string]: unknown} & {name: string}

export interface Option<T> {
  displayName: string
  value: T
}

interface ArgumentClassBuilder<EventFields extends EventBase, Field extends keyof EventFields> {
  options(options: Array<Option<EventFields[Field]>>): void
}

export interface EventHandler<T = any, EventFields extends EventBase = EventBase> {
  (event: EventFields, model?: T): T
}

export interface EventClassBuilder<T, EventFields extends EventBase> {
  addArgument: <Field extends keyof EventFields>(name: Field, displayName?: string) =>
    ArgumentClassBuilder<EventFields, Field>
  getArgument: <Field extends keyof EventFields>(name: Field) => EventFields[Field] | undefined
  handle: (handler: EventHandler<T, EventFields>) => EventClassBuilder<T, EventFields>
}

export interface EventClassCreator<T> {
  <EventFields extends EventBase>(name: EventFields['name'], displayName?: string): EventClassBuilder<T, EventFields>
}

export type EventClassesBuilder<T> = (model: T, addEventClass: EventClassCreator<T>) => void

export interface BuilderMethods<T> {
  seed: () => T
  eventClasses: EventClassesBuilder<T>
}

export interface ArgumentClass {
  name: string
  displayName: string
  options?: Option<unknown>[]
}

export interface EventClass<T = any, EventFields extends EventBase = EventBase> {
  name: string
  displayName: string
  arguments: ArgumentClass[]
  handlers: EventHandler<T, EventFields>[]
}

export interface Builder<T> {
  model: T
  eventClasses: EventClass[]
  hintEvent(event: EventBase): Builder<T>
  raiseEvent(event: EventBase): Builder<T>
}
