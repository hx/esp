import Big from 'big.js'

interface Sum {
  (nums: Big[]): Big
  (...nums: Big[]): Big
  <T>(nums: T[], mapper: (num: T) => Big): Big
}

const isBig = (obj: unknown): obj is Big => obj instanceof Big
export const zero = new Big(0)

export const sum: Sum = <T>(...args: unknown[]) => {
  if (args.every(isBig)) {
    return sum(args)
  }

  if (args.length === 2) {
    const [nums, mapper] = args as [T[], (num: T) => Big]
    if (Array.isArray(nums) && typeof mapper === 'function') {
      return sum(nums.map(mapper))
    }
  }

  const nums = args[0] as Big[]
  return nums.length === 0 ? zero : nums.reduce((a, b) => a.plus(b))
}
