import Big from 'big.js'
import { CartInterface } from './Cart'

interface Line {
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

export interface TaxCalculation {
  lines: Line[]
}

export function taxCalculationIsApplicable(taxCalculation: TaxCalculation, cart: CartInterface) {
  const taxLines = taxCalculation.lines
  const saleItems = cart.saleItems()

  return taxLines.length === saleItems.length && taxLines.every((taxLine, index) => {
    const saleItem = saleItems[index]
    return taxLine.productId === saleItem.productId &&
      taxLine.unitPrice.eq(saleItem.amount) &&
      taxLine.quantity === saleItem.quantity
  })
}
