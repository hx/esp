import React, {FC} from 'react'
import {MoneyFormatter} from '../currency/MoneyFormatter'
import {Item} from '../Cart'
import {PromotionItemInterface} from './PromotionItem'

export const PromotionItemsView: FC<{ promotionItems: PromotionItemInterface[], otherItems: Item[], format: MoneyFormatter }> = ({promotionItems, format}) => {
  return (<>
    {promotionItems.map(promotionItem => (
      <tr className="small" key={promotionItem.id}>
        <td className="text-end">{promotionItem.id}</td>
        <td className="text-end text-muted" colSpan={3}>{promotionItem.description}</td>
        <td className="text-end">-{format(promotionItem.total())}</td>
      </tr>
    ))}
  </>)
}
