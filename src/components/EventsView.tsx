import React, { FC } from 'react'
import { EventBase } from '../esp'
import { EventView } from './EventView'

export const EventsView: FC<{ events: EventBase[], undone: EventBase[] }> = ({events, undone}) =>
  <div className="event-list">
    {events.map((event, eventIndex) => <EventView key={eventIndex} index={eventIndex} event={event}/>)}
    {undone.map((event, eventIndex) => <EventView key={eventIndex} index={eventIndex} event={event} muted/>)}
  </div>
