import {CartInterface} from './checkout/Cart'
import {InventoryEntry} from "./inventory/InventoryEntry";
import {replaceAtIndex} from "../utilities";

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
    {productId: 'Apples', quantity: 100},
    {productId: 'Bananas', quantity: 100},
    {productId: 'Carrots', quantity: 100}
  ]
}

export class Store {
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
