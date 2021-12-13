import React from 'react'
import { render } from 'react-dom'
import { Aggregate } from './esp'
import { App, View } from './components'
import { SavedState, load, save } from './persistence'

export const boot = <T extends unknown>(aggregate: Aggregate<T>, view: View<T>) => {
  const container = document.getElementById('app')
  const key = view.name
  const onChange = (state: SavedState) => save(key, state)

  render(
    <App
      aggregate={aggregate}
      view={view}
      initialState={load(key)}
      /* eslint-disable-next-line react/jsx-no-bind */
      onChange={onChange}
    />,
    container
  )
}
