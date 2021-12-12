/**
 * Use one or more `Option`s to constrain an {@link ArgumentClass} to an enumeration.
 */
export interface Option<T> {
  /**
   * Name of the option to be displayed in the GUI.
   */
  displayName: string
  value: T
}
