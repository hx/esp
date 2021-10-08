import Big from 'big.js'
import {Either, left, right} from 'fp-ts/Either'
import {Currency} from './currency/currencyBuilder'
import {LogicError, ValidationError} from './package'
import {isPayment, Payment} from './payment/Payment'
import {isSaleItem, SaleItem, SaleItemInterface} from './productLineItem/ProductLineItem'
import {isPromotionItem, PromotionItemInterface} from './promotion/PromotionItem'
import {isTaxItem, TaxItemInterface} from './tax/TaxItem'
import {sum} from './util/sum'

export interface Line {
  id: number
}

export interface Item extends Line {
  total(): Big
}

export const isItem = (obj: unknown): obj is Item => !isPayment(obj)

export interface CartInterface {
  currencyCode: Currency
  lines: Line[]

  hasItems(): boolean
  items(): Item[]
  saleItems(): SaleItemInterface[]
  findSaleItem(id: number): Either<string, SaleItemInterface>
  hasSaleItems(): boolean
  lastSaleItem(): SaleItemInterface
  payments(): Payment[]
  taxItems(): TaxItemInterface[]
  promotionItems(): PromotionItemInterface[]
  totalPromotions(): Big
  nextItemId(): number
  nextPaymentId(): number
  changeQuantity(id: number, quantity: number): Either<LogicError, CartInterface>
  addItem(name: string, quantity: number, amount: Big): Either<ValidationError, CartInterface>
  totalPayments(): Big
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
    lines: Line[]
  ) {
    this.currencyCode = currencyCode
    this.lines = lines
  }

  saleItems(): SaleItemInterface[] {
    return this.lines.filter(isSaleItem)
  }

  taxItems(): TaxItemInterface[] {
    return this.lines.filter(isTaxItem)
  }

  promotionItems(): PromotionItemInterface[] {
    return this.lines.filter(isPromotionItem)
  }

  items(): Item[] {
    return this.lines.filter(isItem)
  }

  payments(): Payment[] {
    return this.lines.filter(isPayment)
  }

  findSaleItem(id: number): Either<string, SaleItemInterface> {
    const item = this.saleItems().find(item => item.id == id)
    return item ? right(item) : left(`Could not find sales item with id: ${id}`)
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
            saleItem.name,
            quantity,
            saleItem.amount
          )
        }))
      )
    )
  }

  hasSaleItems(): boolean {
    return this.saleItems().length > 0
  }

  addItem(name: string, quantity: number, price: Big): Either<ValidationError, CartInterface> {
    if (name === '') return left('Name must not be blank')
    return right(
      new Cart(
        this.currencyCode,
        [
          ...this.lines,
          new SaleItem(
            this.nextItemId(),
            name,
            quantity,
            price
          )
        ]
      )
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

  totalTax(): Big {
    return sum(this.taxItems(), i => i.total())
  }

  totalPromotions(): Big {
    const v = sum(this.promotionItems(), p => p.total())
    const l = v.toString()
    return v
  }

  total(): Big {
    const t = sum([
      ...this.saleItems(),
      ...this.taxItems(),
    ], i => i.total())
    const p = this.totalPromotions()
    return t.sub(p)
  }

  balance(): Big {
    const t = this.total()
    const p = this.totalPayments()
    return t.sub(p)
  }
}
