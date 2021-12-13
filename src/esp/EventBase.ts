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
   * Comment is optional, and will be displayed by the GUI next to the event.
   */
  comment?: string
}
