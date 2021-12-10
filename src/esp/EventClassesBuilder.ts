import { EventClassCreator } from './EventClassCreator'

export type EventClassesBuilder<T> = (model: T, addEventClass: EventClassCreator<T>) => void
