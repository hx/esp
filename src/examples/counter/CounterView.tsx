import React, { FC } from 'react'
import { Counter } from './Counter'

export const CounterView: FC<{ model: Counter }> = ({model: counter}) => <h2>Count: {counter.count}</h2>
