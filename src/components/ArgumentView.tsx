import React, { FC, useCallback, useMemo, useRef, useState } from 'react'
import { ArgumentClass } from '../esp/ArgumentClass'
import { Scalar } from '../esp/types'

let argID = 0

interface Props {
  arg: ArgumentClass
  value: Scalar
  onChange: (newValue: {[key in string]: unknown}) => void
}

export const ArgumentView: FC<Props> = (props) => {
  const {arg} = props
  const id = useMemo(() => `argumentView${argID++}`, [])

  if (typeof arg.default === 'boolean') {
    return <Checkbox {...props} id={id}/>
  }

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

const Checkbox: FC<ArgProps> = ({arg, onChange, id, value}) => {
  const change = useCallback(e => onChange({[arg.name]: e.target.checked}), [onChange])

  return (
    <div className="form-check">
      <input className="form-check-input" type="checkbox" id={id} defaultChecked={Boolean(value)} onChange={change}/>
      <label className="form-check-label" htmlFor={id}>{arg.displayName}</label>
    </div>
  )
}

const Text: FC<ArgProps> = ({arg, onChange, id, value}) => {
  const ref = useRef<HTMLInputElement>(null)
  const focus = useCallback(() => ref.current?.select(), [ref])

  const [text, setText] = useState(String(value))
  const change = useCallback(e => {
    const newValue = e.target.value
    if (typeof value !== 'number' || /^-?\d+\.?\d*$/.test(newValue)) {
      setText(newValue)
    }
  }, [value])

  const update = useCallback(
    () => {
      let newVal: Scalar = text
      if (typeof value === 'number') {
        newVal = +text
      }
      onChange({[arg.name]: newVal})
    },
    [arg, onChange, text, value]
  )

  return (
    <input
      ref={ref}
      type="text"
      className="form-control"
      id={id}
      onBlur={update}
      onFocus={focus}
      value={text}
      onChange={change}
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
    <select className="form-select" value={String(value)} onChange={update} id={id}>
      {arg.options.map((opt, i) => <option value={String(opt.value)} key={i}>{opt.displayName}</option>)}
    </select>
  )
}
