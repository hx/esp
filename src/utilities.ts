type obj = Record<string | number | symbol, unknown>;

export const isObj = (x: unknown): x is obj => x !== null && typeof x === 'object'

export const mapToObj = <K extends keyof never, V, I>(
  array: Readonly<I[]>,
  callback: (o: I, i: number, a: Readonly<I[]>) => [K, V],
): Record<K, V> => Object.fromEntries(array.map(callback)) as Record<K, V>

export const unique = <T>(value: T, index: keyof T[], self: T[]): boolean => self.indexOf(value) === index
