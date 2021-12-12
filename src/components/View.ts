import { FC } from 'react'

export interface Props<T>{
  projection: T
}

export type View<T> = FC<Props<T>>
