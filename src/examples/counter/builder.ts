import { EventBase, createAggregate } from '../../esp'
import { Counter } from './Counter'

type IncrementEvent = EventBase<'increment', {
    quantity: number
}>
type DecrementEvent = EventBase<'decrement', {
    quantity: number
}>

const DEFAULTS: Counter = {count: 0}

export const createCounterAggregate = (counter: Partial<Counter> = {}) => createAggregate(
  {...DEFAULTS, ...counter},
  (counter, add) => {
    add<IncrementEvent>('increment', 'Increment')
      .handle(({event}) => ({count: counter.count + event.args.quantity}))
      .addArgument('quantity', 'Quantity', 1)
    add<DecrementEvent>('decrement', 'Decrement')
      .handle(({event}) => ({count: counter.count - event.args.quantity}))
      .addArgument('quantity', 'Quantity', 1)
  }
)
