import { EventBase } from './esp'

export interface SavedState {
  history: EventBase[]
  undoneCount: number
}

const PREFIX = 'ESP.appState.'
const CLEAN_STATE = {history: [], undoneCount: 0}

export function load(persistenceKey: string): SavedState {
  const stateStr = localStorage.getItem(PREFIX + persistenceKey)
  return stateStr ? JSON.parse(stateStr) : CLEAN_STATE
}

export function save(persistenceKey: string, state: SavedState) {
  localStorage.setItem(PREFIX + persistenceKey, JSON.stringify(state))
}
