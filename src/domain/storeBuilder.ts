import { createAggregate } from '../esp'
import { CartInterface } from './checkout/Cart'
import {newStore} from './Store'
import { createCartAggregate } from './checkout/aggregate'

export const createStore = (cart: CartInterface) => createAggregate(
  newStore(cart),
  (store, add) => {
    createCartAggregate(store, add)
  }
)
