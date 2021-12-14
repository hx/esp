import Big from 'big.js'
import { Either, left, right } from 'fp-ts/Either'
import { Product } from '../catalogue/Product'
import { Currency } from './currency/currencyBuilder'
import { isShipping, Shipping } from './fulfilment/Shipping'
import { LogicError } from './package'
import { isPayment, Payment } from './payment/Payment'
import { isSaleItem, SaleItem, SaleItemInterface } from './productLineItem/ProductLineItem'
import { isPromotionItem, PromotionItemInterface } from './promotion/PromotionItem'
import { isTaxItem, TaxItem, TaxItemInterface } from './tax/TaxItem'
import { ItemID } from './types'
import { sum } from './util/sum'
import { TaxCalculation, taxCalculationIsApplicable } from './TaxCalculation'

export interface Line {
    id: number
}

export interface Item extends Line {
    total(cart: CartInterface): Big
}

export const isItem = (obj: unknown): obj is Item => !isPayment(obj)

export interface CartInterface {
    currencyCode: Currency
    lines: Line[]

    /**
     * Stack of historic tax calculations. Newer calculations are at the front (index 0) of the array.
     */
    taxCalculations: TaxCalculation[]

    hasItems(): boolean
    items(): Item[]
    saleItems(): SaleItemInterface[]
    findSaleItem(id: number): Either<string, SaleItemInterface>
    findSaleItems(ids: ItemID[]): SaleItemInterface[]
    findTaxItemsBySaleItemId(id: ItemID): TaxItem[]
    hasSaleItems(): boolean
    lastSaleItem(): SaleItemInterface
    payments(): Payment[]
    taxItems(): TaxItemInterface[]
    promotionItems(): PromotionItemInterface[]
    shipments(): Shipping[]
    totalPromotions(): Big
    nextItemId(): number
    nextPaymentId(): number
    changeQuantity(id: number, quantity: number): Either<LogicError, CartInterface>
    addItem(product: Product, quantity: number): CartInterface
    totalPayments(): Big
    totalShipments(): Big
    totalTax(): Big
    total(): Big
    balance(): Big
}

export class Cart implements CartInterface {
  nextPaymentId(): number {
    const payments = this.payments()
    return payments.length == 0 ? 1 : payments[payments.length].id + 1
  }

    currencyCode: Currency = 'AUD'
    lines: Line[] = []

    constructor(
      currencyCode: Currency,
      lines: Line[],
      public taxCalculations: TaxCalculation[]
    ) {
      this.currencyCode = currencyCode
      this.lines = lines
    }

    shipments(): Shipping[]{
      return this.lines.filter(isShipping)
    }

    saleItems(): SaleItemInterface[] {
      return this.lines.filter(isSaleItem)
    }

    private virtualItems(): Item[] {
      const calc = this.applicableTaxCalculation()
      if (calc) {
        const saleItems = this.saleItems()
        return calc.lines.map((line, index) => new TaxItem(
          0,
          saleItems[index].id,
          line.taxRate,
          `${line.taxRate.times(100).round(2)}% tax`,
        ))
      }
      return []
    }

    taxItems(): TaxItemInterface[] {
      return this.items().filter(isTaxItem)
    }

    promotionItems(): PromotionItemInterface[] {
      return this.lines.filter(isPromotionItem)
    }

    items(): Item[] {
      return this.lines.concat(this.virtualItems()).filter(isItem)
    }

    payments(): Payment[] {
      return this.lines.filter(isPayment)
    }

    findSaleItem(id: number): Either<string, SaleItemInterface> {
      const item = this.saleItems().find(item => item.id == id)
      return item ? right(item) : left(`Could not find sales item with id: ${id}`)
    }

    findSaleItems(ids: ItemID[]): SaleItemInterface[] {
      return this.saleItems().filter(saleItem => ids.includes(saleItem.id))
    }

    changeQuantity(id: number, quantity: number): Either<LogicError, CartInterface> {
      const saleItem = this.saleItems().find((item: SaleItemInterface) => item.id == id)
      if (!saleItem) return left(`Could not find item with id: ${id}`)
      return right(
        new Cart(
          this.currencyCode,
          this.lines.map((item => {
            if (item.id != id) return item
            else return new SaleItem(
              saleItem.id,
              saleItem.productId,
              quantity,
              saleItem.amount
            )
          })),
          this.taxCalculations
        )
      )
    }

    hasSaleItems(): boolean {
      return this.saleItems().length > 0
    }

    addItem(product: Product, quantity: number): CartInterface {
      const price = product.prices.find(p => p.currency === this.currencyCode)!
      const saleItemId = this.nextItemId()
      return new Cart(
        this.currencyCode,
        [
          ...this.lines,
          new SaleItem(
            saleItemId,
            product.id,
            quantity,
            price.principal
          ),
          ...price.taxes.map((tax, i) =>
            new TaxItem(
              saleItemId + i + 1,
              saleItemId,
              tax.rate,
              tax.code,
            )
          )
        ],
        this.taxCalculations
      )
    }

    nextItemId(): number {
      if (this.lines.length === 0) return 1
      else return this.lines[this.lines.length - 1].id + 1
    }

    lastSaleItem(): SaleItemInterface {
      const saleItems = this.saleItems()
      return saleItems[saleItems.length - 1]
    }

    hasItems(): boolean {
      return this.lines.length > 0
    }

    totalPayments(): Big {
      return sum(this.payments(), p => p.amount)
    }
    totalShipments(): Big {
      return sum(this.shipments(), p => p.amount)
    }

    totalTax(): Big {
      return sum(this.taxItems(), i => i.total(this))
    }

    totalPromotions(): Big {
      return sum(this.promotionItems(), p => p.total(this))
    }

    total(): Big {
      const t = sum([
        ...this.saleItems(),
        ...this.taxItems(),
      ], i => i.total(this))
      const p = this.totalPromotions()
      return t.sub(p)
    }

    balance(): Big {
      const t = this.total()
      const p = this.totalPayments()
      return t.sub(p)
    }

    findTaxItemsBySaleItemId(id: ItemID): TaxItemInterface[] {
      return this.items().filter(i => isTaxItem(i) && i.saleItemId === id) as TaxItemInterface[]
    }

    applicableTaxCalculation(): TaxCalculation | undefined {
      return this.taxCalculations.find(calc => taxCalculationIsApplicable(calc, this))
    }
}
