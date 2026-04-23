import { Button } from '@heroui/react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { ManualSaleItem } from '../types'

interface SaleItemsListProps {
  items: ManualSaleItem[]
  onUpdateQuantity: (itemKey: number, quantity: number) => void
  onRemove: (itemKey: number) => void
}

export default function SaleItemsList({ items, onUpdateQuantity, onRemove }: SaleItemsListProps) {
  if (items.length === 0) return null

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
      <h3 className="text-sm font-medium text-text-muted uppercase">Productos agregados</h3>

      {items.map((item) => {
        const key = item.productVariationId || item.productId
        return (
          <div key={key} className="flex items-center gap-3 rounded-lg bg-bg p-3">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface text-text-muted text-xs">N/A</div>
            )}

            <div className="flex flex-1 flex-col">
              <span className="text-sm font-medium text-text">{item.productName}</span>
              <span className="text-xs text-text-muted">
                {item.variationLabel}
                {item.originalPrice && item.originalPrice !== item.price ? (
                  <> · <span className="line-through text-text-muted">${Number(item.originalPrice).toFixed(2)}</span> <span className="text-green-400">${Number(item.price).toFixed(2)}</span></>
                ) : (
                  <> · ${Number(item.price).toFixed(2)}</>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button isIconOnly size="sm" variant="flat" onPress={() => onUpdateQuantity(key, item.quantity - 1)} isDisabled={item.quantity <= 1}>
                <Minus size={14} />
              </Button>
              <span className="w-8 text-center text-sm text-text">{item.quantity}</span>
              <Button isIconOnly size="sm" variant="flat" onPress={() => onUpdateQuantity(key, item.quantity + 1)}>
                <Plus size={14} />
              </Button>
            </div>

            <span className="min-w-16 text-right text-sm font-semibold text-accent">
              ${(item.price * item.quantity).toFixed(2)}
            </span>

            <Button isIconOnly size="sm" variant="flat" color="danger" onPress={() => onRemove(key)}>
              <Trash2 size={14} />
            </Button>
          </div>
        )
      })}
    </div>
  )
}
