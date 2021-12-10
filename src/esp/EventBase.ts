import { AnyArgs } from './types'

export interface EventBase<name extends string = string, Args extends AnyArgs = AnyArgs> {
  name: name
  args: Args
  description?: string
  errors?: string[]
}
