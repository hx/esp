import { ArgumentClass } from './ArgumentClass'
import { EventBase } from './EventBase'
import { EventHandler } from './EventHandler'

export interface EventClass<T = any, EventType extends EventBase = EventBase> {
  name: string
  displayName: string
  arguments: ArgumentClass[]
  handlers: EventHandler<T, EventType>[]
}
