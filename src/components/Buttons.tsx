import React, { FC, useCallback, useMemo } from 'react'
import { EventClass } from '../esp/Builder'
import { UndoRedo } from './UndoRedo'

interface Props extends UndoRedo {
  classes: EventClass[],
  onSelect: (name: string) => void
}

export const Buttons: FC<Props> = ({classes, onSelect, undo, redo}) => {
  const sel = useCallback(e => onSelect(e.target.getAttribute('data-name')), [])
  const onUndo = useMemo(() => () => undo?.(), [undo])
  const onRedo = useMemo(() => () => redo?.(), [redo])

  return <div className="buttons my-2">
    {classes.map((c, i) => (
      <React.Fragment key={i}>
        <button type="button" className="btn btn-primary mb-1" data-name={c.name} onClick={sel}>{c.displayName}</button>
        {' '}
      </React.Fragment>
    ))}
    {undo && <button type="button" className="btn btn-dark mb-1" onClick={onUndo}>Undo</button>}
    {' '}
    {redo && <button type="button" className="btn btn-dark mb-1" onClick={onRedo}>Redo</button>}
  </div>
}
