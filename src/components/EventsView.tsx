import classNames from 'classnames'
import React, { FC } from 'react'
import { EventBase } from '../esp'
import { EventView } from './EventView'

export const EventsView: FC<{ events: EventBase[], muted?: boolean }> = ({events, muted}) =>
  <div className={classNames('event-list', {'opacity-25': muted})}>
    {events.map((event, eventIndex) => <EventView key={eventIndex} index={eventIndex} event={event}/>)}
  </div>
