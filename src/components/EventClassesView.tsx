import React, { FC, useCallback, useState } from 'react'
import { EventBase, EventClass } from '../esp/Aggregate'
import { Buttons } from './Buttons'
import { SelectedEventClassView } from './SelectedEventClassView'
import { UndoRedo } from './UndoRedo'

interface Props extends UndoRedo {
  classes: EventClass[]
  onEvent: (event: EventBase) => void
  onHint: (event: EventBase) => void
  errors: Record<string, string[]>
}

export const EventClassesView: FC<Props> = ({classes, onEvent, onHint, errors, undo, redo}) => {
  const [selectedClassName, setSelectedClassName] = useState('')

  const onSelect = setSelectedClassName
  const onCancel = useCallback(() => setSelectedClassName(''), [])

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
