import { EventBase } from './EventBase'
import { ArgumentClassBuilder } from './ArgumentClassBuilder'
import { EventHandler } from './EventHandler'

/**
 * Builds an {@link EventClass}.
 */
export interface EventClassBuilder<T, EventType extends EventBase> {
  /**
   * Add an argument to the event.
   * @param name Name of the argument, which can be used with {@link getArgument}, and when applying the event in an
   *   {@link EventHandler}.
   * @param displayName The name to be displayed for the argument in the GUI.
   * @param defaultVal The argument's default value, which also determines the argument's type.
   */
  addArgument: <Field extends keyof EventType['args']>(name: Field, displayName?: string, defaultVal?: EventType['args'][Field]) =>
    ArgumentClassBuilder<EventType, Field>

  /**
   * Returns a value for the given argument that may have been set by {@link Aggregate.hintEvent}, or a default value.
   */
  getArgument: <Field extends keyof EventType['args']>(name: Field) => EventType['args'][Field] | undefined

  /**
   * Sets the event's handler.
   */
  handle: (handler: EventHandler<T, EventType>) => EventClassBuilder<T, EventType>
}
