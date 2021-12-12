import { EventBase } from './EventBase'

/**
 * The object passed as an argument to an {@link EventHandler}.
 */
export interface EventHandlerPayload<T, EventType extends EventBase> {
  /**
   * The event to be handled.
   */
  event: EventType

  /**
   * The projection to which the event should be applied.
   */
  projection: T

  /**
   * Reject the event with the given plain-English `reason`. This will display an error in the GUI.
   */
  reject(reason: string): T
}
