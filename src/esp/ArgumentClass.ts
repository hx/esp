import { Scalar } from './types'
import { Option } from './Option'

export interface ArgumentClass {
  name: string
  displayName: string
  options?: Option<Scalar>[]
  default?: Scalar
}
