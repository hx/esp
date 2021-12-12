type obj = Record<string | number | symbol, unknown>;

/**
 * Type predicate for objects that can respond to any key.
 */
export const isObj = (x: unknown): x is obj => x !== null && typeof x === 'object'

/**
 * Maps an array of key/value pairs to an object, like {@link Object.fromEntries}, but preserves types.
 * @param array An array of key/value pairs.
 * @param callback If provided, transforms `array` to the requisite key/value pairs before mapping.
 */
export const mapToObj = <K extends keyof never, V, I>(
  array: Readonly<I[]>,
  callback: (o: I, i: number, a: Readonly<I[]>) => [K, V],
): Record<K, V> => Object.fromEntries(array.map(callback)) as Record<K, V>

export const unique = <T>(value: T, index: keyof T[], self: T[]): boolean => self.indexOf(value) === index

/**
 * Returns a new array by replacing a single item at a given index.
 * @param arr The original array, which will not be modified.
 * @param index The index of the item in `arr` to be replaced.
 * @param items Items to replace the item at `index`. Typically one item, but zero or multiple items is also fine.
 */
export const replaceAtIndex = <T>(arr: T[], index: number, ...items: T[]): T[] =>
  [...arr.slice(0, index), ...items, ...arr.slice(index+1)]
