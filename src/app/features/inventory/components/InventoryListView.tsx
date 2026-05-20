import { Button, Input, Spinner } from '@heroui/react'
import { Search, Eye, Package, Droplets } from 'lucide-react'
import type { Product } from '@/app/features/products/types'

interface InventoryListViewProps {
  products: Product[]
  isLoading: boolean
  search: string
  onSearchChange: (value: string) => void
  onViewDetail: (productId: number) => void
}

export default function InventoryListView({
  products,
  isLoading,
  search,
  onSearchChange,
  onViewDetail,
}: InventoryListViewProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide text-accent sm:text-3xl">
            Inventario
          </h1>
          <p className="mt-1 text-sm text-text-muted">Control de stock y botellas por producto</p>
        </div>
      </div>

      {/* Search */}
      <Input
        placeholder="Buscar producto..."
        value={search}
        onValueChange={onSearchChange}
        startContent={<Search size={16} className="text-text-muted" />}
        classNames={{
          label: '!text-text',
          input: '!text-text',
          inputWrapper: 'bg-surface border-border',
        }}
      />

      {/* Product list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" color="warning" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-muted text-sm">No se encontraron productos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {products.map((product) => {
            const openMl = Number(product.openBottleMlRemaining || 0)
            const totalMl = Number(product.totalMl || 0)
            const availableMl = openMl + product.stock * totalMl

            return (
              <div
                key={product.id}
                className="group flex flex-wrap items-center gap-3 sm:gap-4 rounded-xl border border-border bg-surface p-3 sm:p-4 hover:border-accent/50 transition-colors cursor-pointer"
                onClick={() => onViewDetail(product.id)}
              >
                {/* Image */}
                <div className="w-14 h-14 rounded-lg bg-background overflow-hidden shrink-0">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                      <Package size={20} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 basis-[calc(100%-72px)] sm:basis-auto">
                  <p className="text-sm font-bold text-text truncate">{product.name}</p>
                  <p className="text-xs text-text-muted truncate">
                    {product.category?.name} — {product.marca?.name}
                  </p>
                </div>

                {/* Stock info */}
                <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:gap-6 shrink-0">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-text-muted">
                      <Package size={12} />
                      <span className="text-base sm:text-lg font-bold text-text">{product.stock}</span>
                    </div>
                    <p className="text-xs text-text-muted">Selladas</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-text-muted">
                      <Droplets size={12} />
                      <span className="text-base sm:text-lg font-bold text-text">{openMl}ml</span>
                    </div>
                    <p className="text-xs text-text-muted">Abierta</p>
                  </div>
                  <div className="text-center">
                    <span className="text-base sm:text-lg font-bold text-accent">{availableMl}ml</span>
                    <p className="text-xs text-text-muted">Total</p>
                  </div>
                  {/* Action */}
                  <Button
                    size="sm"
                    variant="flat"
                    color="warning"
                    startContent={<Eye size={14} />}
                    onPress={() => onViewDetail(product.id)}
                    className="h-10 shrink-0"
                  >
                    Ver
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
