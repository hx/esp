import { Aggregate } from './Aggregate'

export interface EventResult<T> {
  aggregate?: Aggregate<T>
  errors?: string[]
}
