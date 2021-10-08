import React, { FC } from 'react'
import { MoneyFormatter } from '../currency/MoneyFormatter'
import {Item} from '../Cart'
import {TaxItemInterface} from './TaxItem'

export const TaxItemsView: FC<{ taxItems: TaxItemInterface[], otherItems: Item[], format: MoneyFormatter }> = ({taxItems, format}) => {
  return (<>
    {taxItems.map(taxItem => (
      <tr className="small" key={taxItem.id}>
        <td className="text-end">{taxItem.id}</td>
        <td className="text-end text-muted" colSpan={3}>{taxItem.description}</td>
        <td className="text-end">{format(taxItem.total())}</td>
      </tr>
    ))}
  </>)
}
