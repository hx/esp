import React, { FC, useCallback, useState } from 'react'
import { EventButtons } from './EventButtons'
import { SelectedEventClassView } from './SelectedEventClassView'
import { UndoRedo } from './UndoRedo'
import { EventClass } from '../esp/EventClass'
import { EventBase } from '../esp'
import { AppButtons } from './AppButtons'

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
      <EventButtons classes={classes} onSelect={onSelect}/>
      <AppButtons undo={undo} redo={redo}/>
    </>
  )
}
