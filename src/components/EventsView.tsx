import React, { FC } from 'react'
import { EventBase } from '../esp'
import { EventView } from './EventView'

export const EventsView: FC<{ events: EventBase[] }> = ({events}) =>
  <div className="eventList">
    {events.map((event, eventIndex) => <EventView key={eventIndex} index={eventIndex} event={event}/>)}
  </div>
