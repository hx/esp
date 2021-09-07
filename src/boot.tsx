import React from 'react'
import { render } from 'react-dom'
import { App, View } from './components/App'
import { Builder } from './esp'

export const boot = <T extends unknown>(builder: Builder<T>, view: View<T>) => {
  const container = document.getElementById('app')
  render(
    <App builder={builder} view={view}/>,
    container
  )
}
