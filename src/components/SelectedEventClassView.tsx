import classNames from 'classnames'
import React, { FC, useCallback, useState } from 'react'
import { EventBase, EventClass } from '../esp/Aggregate'
import { mapToObj } from '../utilities'
import { ArgumentView } from './ArgumentView'

interface Props {
  eventClass: EventClass
  onCancel: () => void
  onCommit: (event: EventBase) => void
  onHint: (event: EventBase) => void
  errors?: string[]
}

export const SelectedEventClassView: FC<Props> = ({
  eventClass: {name, arguments: args, displayName},
  onCancel,
  onCommit,
  onHint,
  errors
}) => {
  const [input, setInput] = useState(mapToObj(args, arg => {
    if (arg.default !== undefined) {
      return [arg.name, arg.default]
    }
    const firstOption = arg.options?.[0]?.value
    if (firstOption !== undefined) {
      return [arg.name, firstOption]
    }
    return [arg.name, '']
  }))

  const change = useCallback(e => {
    const event = {name, args: {...input, ...e}}
    setInput(event.args)
    onHint(event)
  }, [input])

  const commit = useCallback(() => onCommit({name, args: input}), [input])

  const revisedInput: typeof input = {}
  args.filter(a => a.options).forEach(arg => {
    const options = arg.options!
    if (!options[0]) {
      revisedInput[arg.name] = ''
    } else if (!options.find(o => o.value === input[arg.name])) {
      revisedInput[arg.name] = options[0].value
    }
  })
  if (Object.keys(revisedInput).length > 0) {
    setInput(input => ({...input, ...revisedInput}))
  }

  return (
    <div className={classNames('selected-event-class card my-2', {'border-danger': errors !== undefined})}>
      <div className="card-body">
        <div className="card-title">
          <h3>{displayName}</h3>
        </div>
        <div className="card-text">
          <div className="arguments">
            {args.map(arg =>
              <ArgumentView arg={arg} key={arg.name} value={input[arg.name]} onChange={change}/>
            )}
          </div>
          <div className="text-end">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>Cancel</button>
            {' '}
            <button type="button" className="btn btn-primary btn-sm" onClick={commit}>Commit</button>
          </div>
        </div>
      </div>
      {errors &&
      <div className="card-footer bg-danger text-light">
        {errors.map((err, i) => <div className="small" key={i}>{err}</div>)}
      </div>
      }
    </div>
  )
}
