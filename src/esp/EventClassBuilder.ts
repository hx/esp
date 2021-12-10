import { EventBase } from './EventBase'
import { ArgumentClassBuilder } from './ArgumentClassBuilder'
import { EventHandler } from './EventHandler'

export interface EventClassBuilder<T, EventType extends EventBase> {
  addArgument: <Field extends keyof EventType['args']>(name: Field, displayName?: string, defaultVal?: EventType['args'][Field]) =>
    ArgumentClassBuilder<EventType, Field>
  getArgument: <Field extends keyof EventType['args']>(name: Field) => EventType['args'][Field] | undefined
  handle: (handler: EventHandler<T, EventType>) => EventClassBuilder<T, EventType>
}
