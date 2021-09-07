import React, { FC, useCallback, useState } from 'react'
import { EventBase, EventClass } from '../esp/Builder'
import { SelectedEventClassView } from './SelectedEventClassView'

interface Props {
  classes: EventClass[]
  onEvent: (event: EventBase) => void
  onHint: (event: EventBase) => void
  errors: Record<string, string[]>
}

export const EventClassesView: FC<Props> = ({classes, onEvent, onHint, errors}) => {
  const [selectedClassName, setSelectedClassName] = useState('')

  const onSelect = setSelectedClassName
  const onCancel = () => setSelectedClassName('')

  const selectedClass = classes.find(c => c.name === selectedClassName)

  return (
    <>
      {selectedClass &&
      <SelectedEventClassView
        eventClass={selectedClass}
        errors={errors[selectedClassName]}
        onCancel={onCancel}
        onCommit={onEvent}
        onHint={onHint}
      />}
      <Buttons classes={classes} onSelect={onSelect}/>
    </>
  )
}

const Buttons: FC<{ classes: EventClass[], onSelect: (name: string) => void }> = ({classes, onSelect}) => {
  const sel = useCallback(e => onSelect(e.target.getAttribute('data-name')), [])

  return <div className="buttons my-2">
    {classes.map((c, i) => (
      <React.Fragment key={i}>
        <button type="button" className="btn btn-primary" data-name={c.name} onClick={sel}>{c.displayName}</button>
        {' '}
      </React.Fragment>
    ))}
  </div>
}
