import { Button } from '@heroui/react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import type { ManualSaleItem } from '../types'

interface SaleItemsListProps {
  items: ManualSaleItem[]
  onUpdateQuantity: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
}

export default function SaleItemsList({ items, onUpdateQuantity, onRemove }: SaleItemsListProps) {
  if (items.length === 0) return null

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
      <h3 className="text-sm font-medium text-text-muted uppercase">Productos agregados</h3>

      {items.map((item) => (
        <div key={item.productId} className="flex items-center gap-3 rounded-lg bg-bg p-3">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface text-text-muted text-xs">
              N/A
            </div>
          )}

          <div className="flex flex-1 flex-col">
            <span className="text-sm font-medium text-text">{item.productName}</span>
            <span className="text-xs text-text-muted">{item.brand} — ${item.price}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onPress={() => onUpdateQuantity(item.productId, item.quantity - 1)}
              isDisabled={item.quantity <= 1}
            >
              <Minus size={14} />
            </Button>
            <span className="w-8 text-center text-sm text-text">{item.quantity}</span>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onPress={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            >
              <Plus size={14} />
            </Button>
          </div>

          <span className="min-w-16 text-right text-sm font-semibold text-accent">
            ${(item.price * item.quantity).toFixed(2)}
          </span>

          <Button isIconOnly size="sm" variant="flat" color="danger" onPress={() => onRemove(item.productId)}>
            <Trash2 size={14} />
          </Button>
        </div>
      ))}
    </div>
  )
}
