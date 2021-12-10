import React, { FC, useMemo } from 'react'
import { EventClass } from '../esp/Aggregate'
import { Button } from './Button'
import { UndoRedo } from './UndoRedo'

interface Props extends UndoRedo {
  classes: EventClass[],
  onSelect: (name: string) => void
}

export const Buttons: FC<Props> = ({classes, onSelect, undo, redo}) => {
  const onUndo = useMemo(() => () => undo?.(), [undo])
  const onRedo = useMemo(() => () => redo?.(), [redo])

  return <div className="buttons my-2">
    {classes.map((c, i) => (
      <React.Fragment key={i}>
        <Button eventClass={c} onSelect={onSelect}/>
        {' '}
      </React.Fragment>
    ))}
    {undo && <button type="button" className="btn btn-dark mb-1" onClick={onUndo}>Undo</button>}
    {' '}
    {redo && <button type="button" className="btn btn-dark mb-1" onClick={onRedo}>Redo</button>}
  </div>
}
