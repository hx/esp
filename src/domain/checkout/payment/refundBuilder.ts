import { EventBase } from '../../../esp'
import { Applicator } from '../../../esp/Applicator'
import { Store } from '../../Store'

type RefundEvent = EventBase<'issueRefund', {
  amount: number
  saleItemIDs: string
}>

export const buildRefund: Applicator<Store> = (store, add) => {
  const eventClass = add<RefundEvent>('issueRefund', 'Refund')
    .handle(({event: {args}}) => {
      return store // TODO
    })
  eventClass.addArgument('amount', 'Amount', store.cart.total().toNumber())
  eventClass.addArgument('saleItemIDs', 'Sale Items')
}
