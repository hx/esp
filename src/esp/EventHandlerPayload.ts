import { EventBase } from './EventBase'

export interface EventHandlerPayload<T, EventType extends EventBase> {
  event: EventType
  projection: T

  reject(reason: string): T
}
