import React from 'react'
import { render } from 'react-dom'
import { Aggregate } from './esp'
import { App, View } from './components'
import { SavedState, load, save } from './persistence'

export const boot = <T extends unknown>(aggregate: Aggregate<T>, view: View<T>, title?: string) => {
  const container = document.getElementById('app')
  const key = view.name
  const onChange = (state: SavedState) => {
    history.replaceState(null, '', '/#' + encodeURIComponent(JSON.stringify(state)))
    save(key, state)
  }
  let initialState: SavedState
  try {
    initialState = JSON.parse(decodeURIComponent(location.hash.slice(1)))
  } catch(e) {
    initialState = load(key)
  }
  render(
    <App
      title={title || key.replace(/([^A-Z])([A-Z])/g, (_, a, b) => `${a} ${b}`)}
      aggregate={aggregate}
      view={view}
      initialState={initialState}
      /* eslint-disable-next-line react/jsx-no-bind */
      onChange={onChange}
    />,
    container
  )
}
