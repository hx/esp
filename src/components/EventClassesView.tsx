import React, { FC, useCallback, useMemo, useState } from 'react'
import { EventBase, EventClass } from '../esp/Builder'
import { SelectedEventClassView } from './SelectedEventClassView'

interface UndoRedo {
  undo?: () => void
  redo?: () => void
}

interface Props extends UndoRedo {
  classes: EventClass[]
  onEvent: (event: EventBase) => void
  onHint: (event: EventBase) => void
  errors: Record<string, string[]>
}

export const EventClassesView: FC<Props> = ({classes, onEvent, onHint, errors, undo, redo}) => {
  const [selectedClassName, setSelectedClassName] = useState('')

  const onSelect = setSelectedClassName
  const onCancel = () => setSelectedClassName('')

  const selectedClass = classes.find(c => c.name === selectedClassName)

  return (
    <>
      {selectedClass &&
      <SelectedEventClassView
        key={selectedClassName}
        eventClass={selectedClass}
        errors={errors[selectedClassName]}
        onCancel={onCancel}
        onCommit={onEvent}
        onHint={onHint}
      />}
      <Buttons classes={classes} onSelect={onSelect} undo={undo} redo={redo}/>
    </>
  )
}

interface ButtonsProps extends UndoRedo {
  classes: EventClass[],
  onSelect: (name: string) => void
}

const Buttons: FC<ButtonsProps> = ({classes, onSelect, undo, redo}) => {
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
