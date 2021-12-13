import Big from "big.js";
import {ProductTax} from "./ProductTax";

export interface ProductPrice {
  /**
   * 3-letter currency code, e.g. USD.
   */
  currency: string

  /**
   * Unit price excluding tax, in major units (e.g. dollars).
   */
  principal: Big
  taxes: ProductTax[]
}
