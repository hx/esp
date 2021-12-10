import { EventHandlerPayload } from './EventHandlerPayload'
import { EventBase } from './EventBase'

export interface EventHandler<T = any, EventType extends EventBase = EventBase> {
  (payload: EventHandlerPayload<T, EventType>): T
}
