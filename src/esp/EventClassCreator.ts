import { EventBase } from './EventBase'
import { EventClassBuilder } from './EventClassBuilder'

/**
 * The utility function passed to an {@link Applicator}. Call this function to declare a new {@link EventClass}, and
 * create a new {@link EventClassBuilder}.
 */
export interface EventClassCreator<T> {
  <EventType extends EventBase>(name: EventType['name'], displayName?: string): EventClassBuilder<T, EventType>
}
