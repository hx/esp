import {Big} from 'big.js'
import {getOrElse} from 'fp-ts/Either'
import {EventBase, EventClassBuilder} from '../../../esp'
import {EventClassCreator} from '../../../esp/EventClassCreator'
import {Cart, CartInterface} from '../Cart'

export type AddSaleItemEvent = EventBase<'addItem', {
  name: string
  price: number
  quantity: number
}>

export type ChangeQuantityEvent = EventBase<'changeQuantity', {
  itemID: number
  quantity: number
}>
export const buildProductLineItems = (cart: CartInterface, add: EventClassCreator<CartInterface>) => {
  addItem(cart, add)
  addChangeQuantity(cart, add)
}

export function addSaleItemArgument<T extends EventBase<string, { itemID: number }>>(
  builder: EventClassBuilder<CartInterface, T>,
  cart: Cart
){
  builder.addArgument(
    'itemID',
    'Item',
    cart.lastSaleItem().id
  ).options(
    cart.saleItems().map(item => ({displayName: `#${item.id}. ${item.name}`, value: item.id}))
  )
}

function addItem(cart: Cart, add: EventClassCreator<CartInterface>){
  const event = add<AddSaleItemEvent>('addItem', 'Add item').handle(({event: {args}, reject}) => getOrElse(reject)(
    cart.addItem(
      args.name.trim(),
      args.quantity,
      new Big(args.price)
    )
  ))
  event.addArgument('name', 'Item name', `Item #${cart.nextItemId()}`)
  event.addArgument('price', 'Price', 9.0909)
  event.addArgument('quantity', 'Quantity', 1)
}

function addChangeQuantity(cart: CartInterface, add: EventClassCreator<CartInterface>) {
  const saleItems = cart.saleItems()
  if (saleItems.length == 0) return

  const event = add<ChangeQuantityEvent>('changeQuantity', 'Change line quantity')
    .handle(({event: {args}, reject}) => getOrElse(reject)(
      cart.changeQuantity(
        args.itemID,
        args.quantity
      )
    ))
  addSaleItemArgument(event, cart)
  const lastSaleItem = saleItems[saleItems.length - 1]
  event.addArgument('quantity', 'Quantity', lastSaleItem.quantity)
}
