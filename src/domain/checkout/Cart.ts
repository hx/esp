import Big from 'big.js'
import { Either, left, right } from 'fp-ts/Either'
import { Product } from '../catalogue/Product'
import { Currency } from './currency/currencyBuilder'
import { isShipping, Shipping } from './fulfilment/Shipping'
import { LogicError } from './package'
import { isPayment, isRefund, Payment } from './payment/Payment'
import { isSaleItem, SaleItem, SaleItemInterface } from './productLineItem/ProductLineItem'
import { isPromotionItem, PromotionItemInterface } from './promotion/PromotionItem'
import { isTaxItem, TaxItem, TaxItemInterface } from './tax/TaxItem'
import { TaxCalculation, taxCalculationIsApplicable } from './TaxCalculation'
import { ItemID } from './types'
import { sum } from './util/sum'

export interface Line {
  id: number
}

export interface Item extends Line {
  total(cart: CartInterface): Big
}

export const isItem = (obj: unknown): obj is Item => !isPayment(obj) && !isRefund(obj)

export interface CartInterface {
  currencyCode: Currency
  lines: Line[]
  paid: boolean

  /**
   * Stack of historic tax calculations. Newer calculations are at the front (index 0) of the array.
   */
  taxCalculations: TaxCalculation[]

  hasItems(): boolean
  items(): Item[]
  saleItems(): SaleItemInterface[]
  findSaleItem(id: number): Either<string, SaleItemInterface>
  findTaxableItem(id: number): Item
  findTaxableItems(): Item[]
  findSaleItems(ids: ItemID[]): SaleItemInterface[]
  findTaxItems(ids: ItemID[]): TaxItemInterface[]
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
  itemsTotal(): Big
  total(): Big
  balance(): Big
}

export class Cart implements CartInterface {
  findTaxableItem(id: number): Item {
    const saleItem = this.saleItems().find(s => s.id == id)
    if (saleItem) {
      return saleItem
    }
    return this.shipments().find(s => s.id === id)!
  }
  findTaxableItems(): Item[] {
    return [... this.saleItems(), ...this.shipments()]
  }
  nextPaymentId(): number {
    const payments = this.payments()
    return payments.length == 0 ? 1 : payments[payments.length].id + 1
  }

  currencyCode: Currency = 'AUD'
  lines: Line[] = []
  paid: boolean

  constructor(
    currencyCode: Currency,
    lines: Line[],
    public taxCalculations: TaxCalculation[],
    paid: boolean
  ) {
    this.currencyCode = currencyCode
    this.lines = lines
    this.paid = paid || (this.totalPayments().gt(0) && this.balance().eq(0))
  }

  shipments(): Shipping[] {
    return this.lines.filter(isShipping)
  }

  saleItems(): SaleItemInterface[] {
    return this.lines.filter(isSaleItem)
  }

  private virtualItems(): Item[] {
    const calc = this.applicableTaxCalculation()
    if (calc) {
      const saleItems = this.saleItems()
      const shipments = this.shipments()
      const nextId = this.nextItemId()
      return [... calc.productLines.map((line, index) => new TaxItem(
        nextId + index,
        saleItems[index].id,
        line.taxRate,
        `${line.taxRate.times(100).round(2)}% tax`,
      )),
      ...calc.shipmentLines.map((line, index) => new TaxItem(
        calc.productLines.length + nextId + index,
        shipments[index].id,
        line.taxRate,
        `${line.taxRate.times(100).round(2)}% tax`,
      )),
      ]
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
  findTaxItems(ids: ItemID[]): TaxItemInterface[] {
    return this.taxItems().filter(taxItem => ids.includes(taxItem.saleItemId))
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
        this.taxCalculations,
        this.paid
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
      this.taxCalculations,
      this.paid
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
    const shipments = this.shipments()
    return sum(shipments, p => p.amount).add(
      sum(this.findTaxItems(shipments.map(i => i.id)), t => t.total(this)))
  }

  totalTax(): Big {
    return sum(this.taxItems(), i => i.total(this))
  }

  totalPromotions(): Big {
    return sum(this.promotionItems(), p => p.total(this))
  }

  total(): Big {
    return sum([
      ...this.saleItems(),
      ...this.taxItems(),
    ],
    i => i.total(this)
    ).sub(this.totalPromotions())
  }
  itemsTotal(): Big {
    const saleItems = this.saleItems()
    return sum([
      ...saleItems,
      ...this.findTaxItems(saleItems.map(i => i.id)),
    ],
    i => i.total(this)
    ).sub(this.totalPromotions())
  }

  balance(): Big {
    return this.total().add(this.totalShipments()).sub(this.totalPayments())
  }

  findTaxItemsBySaleItemId(id: ItemID): TaxItemInterface[] {
    return this.items().filter(i => isTaxItem(i) && i.saleItemId === id) as TaxItemInterface[]
  }

  applicableTaxCalculation(): TaxCalculation | undefined {
    return this.taxCalculations.find(calc => taxCalculationIsApplicable(calc, this))
  }
}
