import React, { FC } from 'react'
import { Counter } from './Counter'
import { Props } from '../../components'
export const CounterView: FC<Props<Counter>> = ({aggregate: {projection: counter}}) => <h2>Count: {counter.count}</h2>
