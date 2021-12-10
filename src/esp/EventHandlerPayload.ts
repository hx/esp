import { EventBase } from './EventBase'

export interface EventHandlerPayload<T, EventType extends EventBase> {
  event: EventType
  model: T

  reject(reason: string): T
}
