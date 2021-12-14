import Big from 'big.js'

export interface ProductTax {
  /**
   * Tax code, e.g. GST.
   */
  code: string

  /**
   * Fractional tax rate e.g 0.1 for 10%.
   */
  rate: Big
}
