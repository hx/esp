import { Big } from 'big.js'
import { EventBase } from '../../../esp'
import { EventClassCreator } from '../../../esp/EventClassCreator'
import { Cart } from '../Cart'
import { makeFormatter } from '../currency/MoneyFormatter'
import { addSaleItemArgument } from '../productLineItem/productBuilder'
import { SaleItemInterface } from '../productLineItem/ProductLineItem'
import { PromotionItem } from './PromotionItem'
import { fold } from 'fp-ts/Either'
import { Store } from '../../Store'

type PromotionEvent = EventBase<'promotion', {
  itemID: number
  amount: number
}>

export const buildPromotionLineItems = (store: Store, add: EventClassCreator<Store>) => {
  const cart = store.cart
  if (cart.saleItems().length > 0) addPromotion(store, add)
}

function addPromotion(store: Store, add: EventClassCreator<Store>) {
  const cart = store.cart
  const format = makeFormatter(cart.currencyCode)
  const event = add<PromotionEvent>('promotion', 'Promotion')
    .handle(({event: {args: {amount, itemID}}, reject}) => {
      const creatPromotionItem = (saleItem: SaleItemInterface) => {
        const promotionItem = new PromotionItem(
          cart.nextItemId(),
          saleItem.id,
          `${format(Big(amount))} off`,
          Big(amount),
        )
        return new Store(
          new Cart(cart.currencyCode, [
            ...cart.lines,
            promotionItem
          ])
        )
      }
      return fold(reject, creatPromotionItem)(cart.findSaleItem(itemID))
    })
  addSaleItemArgument(event, cart)
  event.addArgument('amount', 'Amount', 4)
}
