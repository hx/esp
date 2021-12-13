import classNames from 'classnames'
import React, { FC, useCallback } from 'react'
import { EventBase } from '../esp'
import { EventPairs } from './EventPairs'

interface Props {
  event: EventBase,
  index: number,
  muted?: boolean
  onEnter: (index: number) => void
}

export const EventView: FC<Props> = ({
  event: {args, description, name, comment},
  index, muted, onEnter
}) => {
  const enter = useCallback(() => onEnter(index), [onEnter, index])

  return (
    <div className={classNames('event', {'opacity-25': muted})} onMouseEnter={enter}>
      <span className="index badge bg-light text-secondary">{index + 1}</span>{' '}
      <span className="event-name badge bg-primary">{name}</span>
      <div className="arguments d-inline">
        {description ?
          <span className="small mx-2">{description}</span> :
          <EventPairs args={args}/>
        }
      </div>
      {typeof comment === 'string' && <div className="comment">{comment}</div>}
    </div>
  )
}
