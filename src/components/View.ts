import { FC } from 'react'
import { Aggregate, EventBase, EventResult } from '../esp'

export type ApplyEvent<T> = (event: EventBase) => EventResult<T>

export interface Props<T>{
  aggregate: Aggregate<T>
  applyEvent: ApplyEvent<T>
}

export type View<T> = FC<Props<T>>
