import React, { FC, useCallback } from 'react'
import { EventClass } from '../esp/EventClass'

interface Props {
  eventClass: EventClass
  onSelect: (name: string) => void
}

export const Button: FC<Props> = ({onSelect, eventClass: c}) => {
  const onClick = useCallback(() => onSelect(c.name), [c])

  return (
    <button type="button" className="btn btn-primary mb-1" onClick={onClick}>{c.displayName}</button>
  )
}
