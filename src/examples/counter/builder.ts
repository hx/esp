import { EventBase, createBuilder } from '../../esp'

type IncrementEvent = EventBase<'increment', {
    amount: number
}>
type DecrementEvent = EventBase<'decrement', {
    amount: number
}>

export const createCounterBuilder = (counter = 0) => createBuilder(
  counter,
  (counter, add) => {
    add<IncrementEvent>('increment', 'Increment')
      .handle(({event}) => (counter + event.args.amount))
      .addArgument('amount', 'Quantity', 1)
    add<DecrementEvent>('decrement', 'Decrement')
      .handle(({event}) => (counter - event.args.amount))
      .addArgument('amount', 'Quantity', 1)
  }
)
