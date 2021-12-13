import { UndoRedo } from './UndoRedo'
import React, { FC, useMemo } from 'react'

export const AppButtons: FC<UndoRedo> = ({undo, redo}) => {
  const onUndo = useMemo(() => () => undo?.(), [undo])
  const onRedo = useMemo(() => () => redo?.(), [redo])

  return <div className="buttons my-2">
    {undo && <button type="button" className="btn btn-dark mb-1" onClick={onUndo}>Undo</button>}
    {' '}
    {redo && <button type="button" className="btn btn-dark mb-1" onClick={onRedo}>Redo</button>}
  </div>
}
