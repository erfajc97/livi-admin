import { useState } from 'react'
import { Button, Spinner } from '@heroui/react'
import { ArrowLeft, Scissors } from 'lucide-react'
import { useOpenBottleMutation } from '@/app/features/products/mutations/useProductMutations'
import InventoryStockCards from './InventoryStockCards'
import BottleEventsTimeline from './BottleEventsTimeline'
import OrderHistoryTable from './OrderHistoryTable'
import OpenBottleModal from '@/app/features/products/components/modals/OpenBottleModal'
import type { InventoryDetail } from '../types'

interface InventoryDetailViewProps {
  detail: InventoryDetail
  isLoading: boolean
  onBack: () => void
}

export default function InventoryDetailView({ detail, isLoading, onBack }: InventoryDetailViewProps) {
  const [openBottleModal, setOpenBottleModal] = useState(false)
  const openBottleMutation = useOpenBottleMutation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" color="warning" />
      </div>
    )
  }

  const { product, inventory, bottleEvents, orderHistory } = detail
  const hasOpenBottle = inventory.openBottleMlRemaining > 0
  const canOpenBottle = inventory.stock >= 1 && !hasOpenBottle

  // Get unique ml sizes from order history for the open bottle modal
  const variationMlSizes = [...new Set(
    orderHistory.filter((o) => !o.isFullBottle && o.mlSize > 0).map((o) => o.mlSize)
  )].sort((a, b) => a - b)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button isIconOnly variant="light" onPress={onBack}>
          <ArrowLeft size={20} className="text-text" />
        </Button>
        <div className="flex items-center gap-3 flex-1">
          {product.imageUrl && (
            <img src={product.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
          )}
          <div>
            <h2 className="text-xl font-heading font-bold text-text">{product.name}</h2>
            <p className="text-xs text-text-muted">
              {product.category?.name} — {product.marca?.name}
            </p>
          </div>
        </div>
        <div>
          {hasOpenBottle ? (
            <p className="text-xs text-blue-400 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
              Botella abierta: {inventory.openBottleMlRemaining}ml restantes
            </p>
          ) : (
            <Button
              size="sm"
              color="warning"
              variant="flat"
              startContent={<Scissors size={14} />}
              onPress={() => setOpenBottleModal(true)}
              isDisabled={!canOpenBottle}
            >
              Abrir botella
            </Button>
          )}
        </div>
      </div>

      {/* Stock cards */}
      <InventoryStockCards
        stock={inventory.stock}
        openMl={inventory.openBottleMlRemaining}
        totalMl={inventory.totalMl}
        availableMl={inventory.availableMl}
      />

      {/* Two column: timeline + orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BottleEventsTimeline events={bottleEvents} />
        <OrderHistoryTable orders={orderHistory} />
      </div>

      {/* Modal */}
      <OpenBottleModal
        isOpen={openBottleModal}
        onOpenChange={setOpenBottleModal}
        productName={product.name}
        totalMl={inventory.totalMl}
        currentStock={inventory.stock}
        variationMlSizes={variationMlSizes}
        isLoading={openBottleMutation.isPending}
        onConfirm={(mlRemaining, note) => {
          openBottleMutation.mutate(
            { productId: product.id, mlRemaining, note },
            { onSuccess: () => setOpenBottleModal(false) },
          )
        }}
      />
    </div>
  )
}
