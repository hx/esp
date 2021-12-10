import React from 'react'
import { render } from 'react-dom'
import { App, View } from './components/App'
import { Aggregate } from './esp'

export const boot = <T extends unknown>(aggregate: Aggregate<T>, view: View<T>) => {
  const container = document.getElementById('app')
  render(
    <App aggregate={aggregate} view={view}/>,
    container
  )
}
