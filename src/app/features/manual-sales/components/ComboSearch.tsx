import { useState, useMemo } from 'react'
import { Input, Spinner } from '@heroui/react'
import { Search, Gift, Plus } from 'lucide-react'
import { useCombosQuery } from '@/app/tanstack-queries/combosQuery'
import type { ManualSaleItem } from '../types'

interface ComboSearchProps {
  onAddCombo: (item: Omit<ManualSaleItem, 'quantity'>) => void
}

export default function ComboSearch({ onAddCombo }: ComboSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: combos = [], isLoading } = useCombosQuery()

  const filtered = useMemo(() => {
    const active = combos.filter((c) => c.isActive)
    if (!searchTerm) return active
    const lower = searchTerm.toLowerCase()
    return active.filter((c) => c.name.toLowerCase().includes(lower))
  }, [combos, searchTerm])

  const handleAddCombo = (combo: (typeof combos)[number]) => {
    const productsDesc = combo.comboProducts?.map((cp) => {
      const name = cp.product?.name ?? 'Producto'
      const ml = cp.productVariation?.mlSize
      return ml ? `${name} ${ml}ml` : name
    }).join(', ') ?? ''

    const originalPrice = combo.comboProducts?.reduce((sum, cp) => {
      const price = Number(cp.productVariation?.price ?? cp.product?.price ?? 0)
      return sum + price * cp.quantity
    }, 0) ?? combo.finalPrice

    onAddCombo({
      productId: combo.comboProducts?.[0]?.productId ?? 0,
      productVariationId: combo.comboProducts?.[0]?.productVariationId ?? 0,
      comboId: combo.id,
      comboProducts: (combo.comboProducts ?? []).map((cp) => ({
        productId: cp.productVariationId ? undefined : cp.productId,
        productVariationId: cp.productVariationId || undefined,
        quantity: cp.quantity,
      })),
      productName: `COMBO: ${combo.name}`,
      variationLabel: productsDesc,
      imageUrl: combo.imageUrl,
      price: combo.finalPrice - (combo.discount ?? 0),
      originalPrice: originalPrice > 0 ? originalPrice : undefined,
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift size={16} className="text-accent" />
          <h3 className="text-sm font-semibold text-text">Combos disponibles</h3>
        </div>
        <span className="text-xs text-text-muted">{filtered.length} {filtered.length === 1 ? 'combo' : 'combos'}</span>
      </div>

      <Input
        placeholder="Buscar combo por nombre..."
        value={searchTerm}
        onValueChange={setSearchTerm}
        startContent={<Search size={16} className="text-text-muted" />}
        size="sm"
        classNames={{ input: '!text-text', inputWrapper: 'bg-bg border border-border' }}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner size="sm" color="warning" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-6">
          {searchTerm ? 'No hay combos con ese nombre.' : 'No hay combos activos.'}
        </p>
      ) : (
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
          {filtered.map((combo) => {
            const finalPrice = combo.finalPrice - (combo.discount ?? 0)
            const hasDiscount = (combo.discount ?? 0) > 0
            return (
              <button
                key={combo.id}
                type="button"
                onClick={() => handleAddCombo(combo)}
                className="group flex items-center gap-3 rounded-lg border border-border bg-bg p-3 text-left hover:border-accent hover:bg-accent/5 transition-colors"
              >
                {combo.imageUrl ? (
                  <img src={combo.imageUrl} alt="" className="h-12 w-12 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface text-accent">
                    <Gift size={18} />
                  </div>
                )}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-medium text-text truncate">{combo.name}</span>
                  <span className="text-xs text-text-muted truncate">
                    {combo.comboProducts?.length ?? 0} productos · {combo.comboProducts?.map((cp) => cp.product?.name).filter(Boolean).slice(0, 2).join(', ')}
                    {(combo.comboProducts?.length ?? 0) > 2 && '...'}
                  </span>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  {hasDiscount && (
                    <span className="text-[10px] line-through text-text-muted">${Number(combo.finalPrice).toFixed(2)}</span>
                  )}
                  <span className="text-sm font-bold text-accent">${finalPrice.toFixed(2)}</span>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent group-hover:bg-accent group-hover:text-bg transition-colors">
                  <Plus size={16} />
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
