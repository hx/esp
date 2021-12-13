import { AppCallbacks } from './AppCallbacks'
import React, { FC, useMemo } from 'react'

export const AppButtons: FC<{ appCallbacks: AppCallbacks }> = ({appCallbacks: {undo, redo, reset}}) => {
  const onUndo = useMemo(() => () => undo?.(), [undo])
  const onRedo = useMemo(() => () => redo?.(), [redo])
  const onReset = useMemo(() => () => reset?.(), [reset])

  return <div className="buttons my-2">
    {undo && <button type="button" className="btn btn-dark btn-sm mb-1" onClick={onUndo}>Undo</button>}
    {' '}
    {redo && <button type="button" className="btn btn-dark btn-sm mb-1" onClick={onRedo}>Redo</button>}
    {' '}
    {reset && <button type="button" className="btn btn-danger btn-sm mb-1" onClick={onReset}>Reset</button>}
  </div>
}
