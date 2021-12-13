import { FC } from 'react'
import { Aggregate } from '../esp'

export interface Props<T>{
  aggregate: Aggregate<T>
}

export type View<T> = FC<Props<T>>
