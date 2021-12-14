import { createAggregate } from '../esp'
import { CartInterface } from './checkout/Cart'
import {newStore} from './Store'
import { createStoreAggregate } from './checkout/aggregate'

export const createStore = (cart: CartInterface) => createAggregate(
  newStore(cart),
  createStoreAggregate
)
