import React, { FC, useCallback, useMemo } from 'react'
import { ArgumentClass } from '../esp/Builder'

let argID = 0

interface Props {
  arg: ArgumentClass
  value: string
  onChange: (newValue: {[key in string]: unknown}) => void
}

export const ArgumentView: FC<Props> = (props) => {
  const {arg} = props
  const id = useMemo(() => `argumentView${argID++}`, [])

  return (
    <div className="argument my-3">
      <label htmlFor={id} className="form-label">{arg.displayName}</label>
      {arg.options ?
        <Select {...props} id={id}/> :
        <Text {...props} id={id}/>
      }
    </div>
  )
}

type ArgProps = Props & {id: string}

const Text: FC<ArgProps> = ({arg, onChange, id}) => {
  const update = useCallback(
    e => onChange({[arg.name]: e.target.value}),
    [arg, onChange]
  )

  return (
    <input
      type="text"
      className="form-control"
      id={id}
      onBlur={update}
    />
  )
}

const Select: FC<ArgProps> = ({arg, value, onChange, id}) => {
  if (!arg.options) {
    return null
  }
  const update = useCallback(
    e => onChange({[arg.name]: arg.options?.find(opt => String(opt.value) === e.target.value)?.value}),
    [arg, onChange]
  )

  return (
    <select className="form-select" value={value} onChange={update} id={id}>
      {arg.options.map((opt, i) => <option value={String(opt.value)} key={i}>{opt.displayName}</option>)}
    </select>
  )
}
