import { CartInterface } from './checkout/Cart'

export class Store {
    public cart: CartInterface
    constructor(cart: CartInterface) {
      this.cart = cart
    }
}
