import { ArgumentClass } from './ArgumentClass'
import { EventBase } from './EventBase'
import { EventHandler } from './EventHandler'

/**
 * Base interface for event classes built by an {@link Applicator}.
 */
export interface EventClass<T = any, EventType extends EventBase = EventBase> {
  name: string
  displayName: string
  arguments: ArgumentClass[]
  handlers: EventHandler<T, EventType>[]
}
