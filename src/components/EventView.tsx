import classNames from 'classnames'
import React, { FC, useMemo } from 'react'
import { EventBase } from '../esp'
import { AnyArgs } from '../esp/Builder'

type Pairs = Array<[string, unknown]>

export const EventView: FC<{ event: EventBase, index: number, muted?: boolean }> = ({
  event: {args, description, name},
  index, muted
}) =>
  <div className={classNames('event', {'opacity-25': muted})}>
    <span className="index badge bg-light text-secondary">{index + 1}</span>{' '}
    <span className="event-name badge bg-primary">{name}</span>
    <div className="arguments d-inline">
      {description ?
        <span className="small mx-2">{description}</span> :
        <EventPairs args={args}/>
      }
    </div>
  </div>

const EventPairs: FC<{ args: AnyArgs }> = ({args}) => {
  const pairs: Pairs = useMemo(
    () => Object.keys(args).map(k => [k, args[k]]),
    [args]
  )

  return (
    <>
      {pairs.map(([name, value]) =>
        <React.Fragment key={name}>
          <span className="badge bg-secondary mx-2">{name}</span>
          <span className="small me-2">{String(value)}</span>
        </React.Fragment>
      )}
    </>
  )
}
