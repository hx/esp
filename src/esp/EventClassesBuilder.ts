import { EventClassCreator } from './EventClassCreator'

export type EventClassesBuilder<T> = (projection: T, addEventClass: EventClassCreator<T>) => void
