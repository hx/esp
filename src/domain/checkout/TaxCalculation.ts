import Big from 'big.js'
import { CartInterface } from './Cart'
import { ShippingMethod } from './fulfilment/Shipping'
import { ItemID } from './types'

interface ProductLine {
  /**
   * Product ID for the line.
   */
  productId: string

  /**
   * Line unit price, excluding tax, in major units (e.g. dollars).
   */
  unitPrice: Big

  /**
   * Line quantity.
   */
  quantity: number

  /**
   * Fractional tax rate for the line, e.g. 0.1 for 10%.
   */
  taxRate: Big
}

interface ShipmentLine {
  method: ShippingMethod
  address: string
  itemIds: ItemID[]
  amount: Big;
  taxRate: Big
}

export interface TaxCalculation {
  productLines: ProductLine[]
  shipmentLines: ShipmentLine[]
}

export function taxCalculationIsApplicable(taxCalculation: TaxCalculation, cart: CartInterface) {
  const saleItems = cart.saleItems()
  const shipments = cart.shipments()

  const productLines = taxCalculation.productLines
  const shipmentLines = taxCalculation.shipmentLines
  return productLines.length === saleItems.length && productLines.every((taxLine, index) => {
    const saleItem = saleItems[index]
    return taxLine.productId === saleItem.productId &&
      taxLine.unitPrice.eq(saleItem.amount) &&
      taxLine.quantity === saleItem.quantity
  }) &&
    shipmentLines.length === shipments.length && shipmentLines.every((taxLine, index) => {
    const shipment = shipments[index]
    return taxLine.method === shipment.method &&
     taxLine.method === shipment.method &&
     taxLine.address === shipment.address &&
     taxLine.itemIds === shipment.itemIds &&
      taxLine.amount.eq(shipment.amount)
  })
}
