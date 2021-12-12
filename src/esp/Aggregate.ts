import { EventClass } from './EventClass'
import { EventBase } from './EventBase'

export interface Aggregate<T> {
  projection: T
  eventClasses: EventClass[]
  hintEvent(event: EventBase): Aggregate<T>
  applyEvent(event: EventBase): Aggregate<T>
}
