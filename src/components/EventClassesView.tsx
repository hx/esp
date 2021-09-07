import React, { FC, useCallback, useMemo, useState } from 'react'
import { EventBase, EventClass } from '../esp/Builder'
import { SelectedEventClassView } from './SelectedEventClassView'

interface Props {
  classes: EventClass[]
  onEvent: (event: EventBase) => void
  onHint: (event: EventBase) => void
  errors: Record<string, string[]>
  undo?: () => void
}

export const EventClassesView: FC<Props> = ({classes, onEvent, onHint, errors, undo}) => {
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
      <Buttons classes={classes} onSelect={onSelect} undo={undo}/>
    </>
  )
}

interface ButtonsProps {
  classes: EventClass[],
  onSelect: (name: string) => void
  undo?: () => void
}

const Buttons: FC<ButtonsProps> = ({classes, onSelect, undo}) => {
  const sel = useCallback(e => onSelect(e.target.getAttribute('data-name')), [])
  const onClick = useMemo(() => () => undo?.(), [undo])

  return <div className="buttons my-2">
    {classes.map((c, i) => (
      <React.Fragment key={i}>
        <button type="button" className="btn btn-primary mb-1" data-name={c.name} onClick={sel}>{c.displayName}</button>
        {' '}
      </React.Fragment>
    ))}
    {undo && <button type="button" className="btn btn-dark mb-1" onClick={onClick}>Undo</button>}
  </div>
}
