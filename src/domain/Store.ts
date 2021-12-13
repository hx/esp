import {CartInterface} from './checkout/Cart'
import {InventoryEntry} from "./inventory/InventoryEntry";
import {replaceAtIndex} from "../utilities";
import {Catalogue} from "./catalogue/Catalogue";
import Big from "big.js";

interface StoreInventory {
  onHand: InventoryEntry[]
}

export function adjustInventoryLevel(inventory: StoreInventory, name: string, adjustment: number): StoreInventory {
  const onHand = inventory.onHand;
  let index = onHand.findIndex(e => e.productId === name);
  if (index === -1) {
    index = onHand.length
  }
  const item = onHand[index]
  return {
    ...inventory,
    onHand: replaceAtIndex(onHand, index, {productId: name, quantity: (item?.quantity || 0) + adjustment})
  }
}

const DEFAULT_INVENTORY: StoreInventory = {
  onHand: [
    {productId: 'appl', quantity: 100},
    {productId: 'bnna', quantity: 100},
    {productId: 'choc', quantity: 100}
  ]
}

const DEFAULT_CATALOGUE: Catalogue = {
  products: [
    {
      id: 'appl',
      name: 'Apples',
      prices: [{currency: 'AUD', principal: Big('1'), taxes: []}]
    },
    {
      id: 'bnna',
      name: 'Bananas',
      prices: [{currency: 'AUD', principal: Big('1.23'), taxes: []}]
    },
    {
      id: 'choc',
      name: 'Chocolate',
      prices: [{currency: 'AUD', principal: Big('9.0909'), taxes: [{code: 'GST', amount: Big('0.9091')}]}]
    },
  ]
}

export class Store {
  public catalogue: Catalogue = DEFAULT_CATALOGUE
  public cart: CartInterface
  public inventory: StoreInventory = DEFAULT_INVENTORY

  constructor(cart: CartInterface) {
    this.cart = cart
  }

  /**
   * Adjust the store's inventory level for the given product name.
   * @param name Name of the product for which inventory level should be adjusted. If the store does not have an
   *   inventory level for a product of this name, it will be added at zero before applying the adjustment.
   * @param adjustment Amount by which the stock level should be adjusted. Zero is a no-op.
   */
  public adjustInventoryLevel(name: string, adjustment: number) {
    this.inventory = adjustInventoryLevel(this.inventory, name, adjustment)
  }
}
