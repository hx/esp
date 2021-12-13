import { createAggregate } from '../esp'
import { CartInterface } from './checkout/Cart'
import { Store } from './Store'
import { createCartAggregate } from './checkout/aggregate'

export const createStore = (cart: CartInterface) => createAggregate(
  new Store(cart),
  (store, add) => {
    createCartAggregate(store, add)
  }
)
