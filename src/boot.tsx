import React from 'react'
import { render } from 'react-dom'
import { Aggregate } from './esp'
import { App, View } from './components'

export const boot = <T extends unknown>(aggregate: Aggregate<T>, view: View<T>) => {
  const container = document.getElementById('app')
  render(
    <App aggregate={aggregate} view={view}/>,
    container
  )
}
