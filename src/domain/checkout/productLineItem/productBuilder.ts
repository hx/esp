import { fold } from 'fp-ts/Either'
import { EventBase, EventClassBuilder } from '../../../esp'
import { EventClassCreator } from '../../../esp/EventClassCreator'
import { Product } from '../../catalogue/Product'
import { Store, adjustInventoryLevel } from '../../Store'
import { Cart, CartInterface } from '../Cart'
import { makeFormatter } from '../currency/MoneyFormatter'
import { sum } from '../util/sum'

export type AddSaleItemEvent = EventBase<'addItem', {
  productId: string
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
    cart.saleItems().map(item => ({displayName: `#${item.id}. ${item.productId}`, value: item.id}))
  )
}

function addItem(store: Store, add: EventClassCreator<Store>){
  const {cart, catalogue} = store
  const event = add<AddSaleItemEvent>('addItem', 'Add item').handle(({event: {args}, reject}) => {
    const product = store.catalogue.products.find(p => p.id === args.productId)
    const inStock = store.inventory.onHand.find(p => p.productId === args.productId)
    if (!product) {
      return reject('Product not found in catalogue')
    }
    if (!inStock) {
      return reject('Product not found in inventory')
    }
    if (inStock.quantity < args.quantity) {
      return reject(`Insufficient stock (${inStock.quantity}/${args.quantity})`)
    }
    return {
      ...store,
      cart: cart.addItem(
        product,
        args.quantity,
      ),
      inventory: adjustInventoryLevel(store.inventory, product.id, -args.quantity)
    }
  })
  const availableProducts = catalogue.products.filter(product => {
    const price = product.prices.find(p => p.currency === cart.currencyCode)
    if (!price) {
      return false
    }
    const inventoryEntry = store.inventory.onHand.find(p => p.productId === product.id)
    return inventoryEntry && inventoryEntry.quantity >= 1
  })
  event.addArgument('productId', 'Product', availableProducts[0]?.id)
    .options(availableProducts.map((product) => {
      return {
        displayName: formatProductAndPrice(product, store.cart.currencyCode),
        value: product.id
      }
    }))
  event.addArgument('quantity', 'Quantity', 1)
}

function formatProductAndPrice(product: Product, currency: string): string {
  const format = makeFormatter(currency)
  const price = product.prices.find(p => p.currency === currency)!
  let result = `${product.name} (${format(price.principal.add(sum(price.taxes.map(t => t.rate))))}`
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
    .handle(({event: {args}, reject}) => {
      const saleItem = cart.saleItems().find(i => i.id == args.itemID)!
      const product = store.catalogue.products.find(p => p.id === saleItem.productId)
      const inStock = store.inventory.onHand.find(p => p.productId === saleItem.productId)
      if (!product) {
        return reject('Product not found in catalogue')
      }
      if (!inStock) {
        return reject('Product not found in inventory')
      }
      const adjustment = saleItem.quantity - args.quantity
      if (inStock.quantity + adjustment < 0) {
        return reject(`Insufficient stock (${inStock.quantity}/${-adjustment})`)
      }
      return fold(reject, (cart: CartInterface) => {
        return (
          {
            ...store,
            cart: cart,
            inventory: adjustInventoryLevel(store.inventory, saleItem.productId, adjustment)
          })
      })(
        cart.changeQuantity(
          args.itemID,
          args.quantity
        )
      )
    })

  addSaleItemArgument(event, cart)
  const lastSaleItem = saleItems[saleItems.length - 1]
  event.addArgument('quantity', 'Quantity', lastSaleItem.quantity)
}
