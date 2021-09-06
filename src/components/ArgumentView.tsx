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
        <Select {...props}/> :
        <input type="text" className="form-control" id={id}/>
      }
    </div>
  )
}

const Select: FC<Props> = ({arg, value, onChange}) => {
  if (!arg.options) {
    return null
  }
  const update = useCallback(
    e => onChange({[arg.name]: arg.options?.find(opt => String(opt.value) === e.target.value)?.value}),
    [arg, onChange]
  )

  return (
    <select className="form-select" value={value} onChange={update}>
      {arg.options.map((opt, i) => <option value={String(opt.value)} key={i}>{opt.displayName}</option>)}
    </select>
  )
}
