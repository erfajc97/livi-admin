import { Button, Spinner } from '@heroui/react'
import { ArrowLeft } from 'lucide-react'
import InventoryStockCards from './InventoryStockCards'
import OrderHistoryTable from './OrderHistoryTable'
import type { InventoryDetail } from '../types'

interface InventoryDetailViewProps {
  detail: InventoryDetail
  isLoading: boolean
  onBack: () => void
}

export default function InventoryDetailView({
  detail,
  isLoading,
  onBack,
}: InventoryDetailViewProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" color="warning" />
      </div>
    )
  }

  const { product, inventory, variations, orderHistory } = detail
  const activeVariations = (variations ?? []).filter((v) => v.isActive)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <Button isIconOnly variant="light" onPress={onBack}>
            <ArrowLeft size={20} className="text-text" />
          </Button>
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt=""
              className="w-12 h-12 rounded-lg object-cover shrink-0"
            />
          )}
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-text truncate">
              {product.name}
            </h2>
            <p className="text-xs text-text-muted truncate">
              {product.category?.name} — {product.marca?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Stock cards */}
      <InventoryStockCards
        stock={inventory.stock}
        variationsCount={activeVariations.length}
      />

      {/* Variations */}
      {activeVariations.length > 0 && (
        <div className="rounded-xl border border-border bg-surface p-6">
          <h3 className="font-heading text-sm font-bold text-text uppercase tracking-wider mb-4">
            Variantes de color
          </h3>
          <div className="flex flex-wrap gap-2">
            {activeVariations.map((v) => (
              <span
                key={v.id}
                className="rounded-full border border-border bg-surface-raised px-3 py-1 text-xs font-medium text-text"
              >
                {v.name} · ${Number(v.price).toFixed(2)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Orders */}
      <OrderHistoryTable orders={orderHistory} />
    </div>
  )
}
