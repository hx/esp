import { EventClassCreator } from './EventClassCreator'

export type Applicator<T> = (projection: T, add: EventClassCreator<T>) => void
