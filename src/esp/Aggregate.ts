import { EventClass } from './EventClass'
import { EventBase } from './EventBase'

/**
 * An aggregate includes a projection, and all logic necessary to apply events to it to create subsequent aggregates.
 */
export interface Aggregate<T> {
  /**
   * The projection as it stands after the events that produced the aggregate.
   */
  projection: T

  /**
   * The classes of events that may be applied to the aggregate.
   */
  eventClasses: EventClass[]

  /**
   * Returns a new aggregate that includes hints from the given event. The projection will remain the same, but event
   * classes may differ, particularly in their default arguments or argument enumerations.
   */
  hintEvent(event: EventBase): Aggregate<T>

  /**
   * Returns a new aggregate by applying the given event. Any changes that may have been applied to event classes by
   * {@link hintEvent} will be discarded.
   */
  applyEvent(event: EventBase): Aggregate<T>
}
