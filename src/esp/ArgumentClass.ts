import { Scalar } from './types'
import { Option } from './Option'

/**
 * Represents a class of argument that can be applied to an {@link EventClass}.
 */
export interface ArgumentClass {
  name: string
  displayName: string

  /**
   * When defined, constrains the argument class to an enumeration of values.
   */
  options?: Option<Scalar>[]

  /**
   * The default value for the argument.
   *
   * The type of this property also determines the type of the argument. Set it to a numeric or boolean value to
   * constrain event arguments to numbers or booleans respectively. If omitted, arguments are treated as strings.
   */
  default?: Scalar
}
