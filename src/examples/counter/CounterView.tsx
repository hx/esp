import React, { FC } from 'react'
import { Counter } from './Counter'

export const CounterView: FC<{ projection: Counter }> = ({projection: counter}) => <h2>Count: {counter.count}</h2>
