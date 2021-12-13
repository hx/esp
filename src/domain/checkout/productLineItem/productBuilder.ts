import {Big} from 'big.js'
import {fold} from 'fp-ts/Either'
import {EventBase, EventClassBuilder} from '../../../esp'
import {EventClassCreator} from '../../../esp/EventClassCreator'
import {Cart, CartInterface} from '../Cart'
import {Store} from '../../Store'
import {Product} from '../../catalogue/Product'
import {makeFormatter} from '../currency/MoneyFormatter'
import {sum} from '../util/sum'

export type AddSaleItemEvent = EventBase<'addItem', {
  name: string
  price: number
  quantity: number
}>

export type ChangeQuantityEvent = EventBase<'changeQuantity', {
  itemID: number
  quantity: number
}>
export const buildProductLineItems = (store: Store, add: EventClassCreator<Store>) => {
  addItem(store, add)
  addChangeQuantity(store, add)
}

export function addSaleItemArgument<T extends EventBase<string, { itemID: number }>>(
  builder: EventClassBuilder<Store, T>,
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

function addItem(store: Store, add: EventClassCreator<Store>){
  const {cart, catalogue} = store
  const event = add<AddSaleItemEvent>('addItem', 'Add item').handle(({event: {args}, reject}) => {
    return fold(
      reject,
      (cart: CartInterface) => new Store(cart)
    )(
      cart.addItem(
        args.name.trim(),
        args.quantity,
        new Big(args.price)
      )
    )
  })
  const availableProducts = catalogue.products.filter(product => {
    const price = product.prices.find(p => p.currency === cart.currencyCode)
    if (!price) {
      return false
    }
    const inventoryEntry = store.inventory.onHand.find(p => p.productId === product.id)
    return inventoryEntry && inventoryEntry.quantity >= 1
  })
  event.addArgument('name', 'Item name', `Item #${store.cart.nextItemId()}`)
    .options(availableProducts.map((product) => {
      return {
        displayName: formatProductAndPrice(product, store.cart.currencyCode),
        value: product.id
      }
    }))
  event.addArgument('price', 'Price', 9.0909)
  event.addArgument('quantity', 'Quantity', 1)
}

function formatProductAndPrice(product: Product, currency: string): string {
  const format = makeFormatter(currency)
  const price = product.prices.find(p => p.currency === currency)!
  let result = `${product.name} (${format(price.principal.add(sum(price.taxes.map(t => t.amount))))}`
  if (price.taxes[0]) {
    result += ' inc tax'
  }
  return result + ')'
}

function addChangeQuantity(store: Store, add: EventClassCreator<Store>) {
  const cart = store.cart
  const saleItems = cart.saleItems()
  if (saleItems.length == 0) return

  const event = add<ChangeQuantityEvent>('changeQuantity', 'Change line quantity')
    .handle(({event: {args}, reject}) => fold(reject,(cart: CartInterface) => new Store(cart))(
      cart.changeQuantity(
        args.itemID,
        args.quantity
      )
    ))

  addSaleItemArgument(event, cart)
  const lastSaleItem = saleItems[saleItems.length - 1]
  event.addArgument('quantity', 'Quantity', lastSaleItem.quantity)
}
