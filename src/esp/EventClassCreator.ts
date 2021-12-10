import { EventBase } from './EventBase'
import { EventClassBuilder } from './EventClassBuilder'

export interface EventClassCreator<T> {
  <EventType extends EventBase>(name: EventType['name'], displayName?: string): EventClassBuilder<T, EventType>
}
