import React, { FC } from 'react'
import { Button } from './Button'
import { EventClass } from '../esp/EventClass'

interface Props {
  classes: EventClass[],
  onSelect: (name: string) => void
}

export const Buttons: FC<Props> = ({classes, onSelect}) => {
  return <div className="buttons my-2">
    {classes.map((c, i) => (
      <React.Fragment key={i}>
        <Button eventClass={c} onSelect={onSelect}/>
        {' '}
      </React.Fragment>
    ))}
  </div>
}
