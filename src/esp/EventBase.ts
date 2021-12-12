import { AnyArgs } from './types'

/**
 * Base interface for events.
 */
export interface EventBase<name extends string = string, Args extends AnyArgs = AnyArgs> {
  name: name
  args: Args

  /**
   * Description is optional, and will be used by the GUI to represent the event.
   */
  description?: string

  /**
   * Errors that occurred when attempting to apply the event to an aggregate.
   */
  errors?: string[]
}
