import React, {FC} from 'react'
import {InventoryEntry} from '../inventory/InventoryEntry'
import {Catalogue} from '../catalogue/Catalogue'
import classNames from 'classnames'

export const InventoryItem: FC<{entry: InventoryEntry, catalogue: Catalogue}> = ({entry: {quantity, productId}, catalogue: {products}}) => {
  const product = products.find(p => p.id === productId)

  return <span className="inventory-item">
    <span className={classNames('badge', 'item-name', 'bg-secondary')}>
      {product?.name || productId}
    </span>
    <span
      className={classNames(
        'badge',
        'item-quantity',
        quantity ? 'text-dark' : 'text-light',
        quantity ? 'bg-light' : 'bg-danger'
      )}
    >
      {quantity}
    </span>
    {' '}
  </span>
}
