import Big from "big.js";

export interface ProductTax {
  /**
   * Tax code, e.g. GST.
   */
  code: string

  /**
   * Amount of tax on a unit of the product, in major units (e.g. dollars).
   */
  amount: Big
}
