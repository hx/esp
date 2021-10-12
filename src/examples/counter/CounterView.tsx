import React, { FC } from 'react'

export const CounterView: FC<{ model: number }> = ({ model } ) => <h2>Count: {model}</h2>
