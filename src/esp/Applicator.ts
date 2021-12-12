import { EventClassCreator } from './EventClassCreator'

/**
 * An Applicator is a function that accepts a projection, and, using calls to `add`, defines the event classes that may
 * be applied to it.
 */
export type Applicator<T> = (projection: T, add: EventClassCreator<T>) => void
