import React, { FC, useMemo } from 'react'
import { AnyArgs } from '../esp/Aggregate'

type Pairs = Array<[string, unknown]>

export const EventPairs: FC<{ args: AnyArgs }> = ({args}) => {
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
