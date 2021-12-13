import {ProductPrice} from './ProductPrice'

export interface Product {
  id: string
  name: string
  prices: ProductPrice[]
}
