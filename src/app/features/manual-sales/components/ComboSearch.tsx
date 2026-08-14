import { useState, useMemo } from 'react'
import { Input, Spinner } from '@heroui/react'
import { Search, Gift, Plus, ChevronDown } from 'lucide-react'
import { useCombosQuery } from '@/app/tanstack-queries/combosQuery'
import type { Combo } from '@/app/features/combos/types'
import type { ManualSaleItem } from '../types'

interface ComboSearchProps {
  onAddCombo: (item: Omit<ManualSaleItem, 'quantity'>) => void
}

/** Descripción legible de lo que trae una versión: "Sauvage 5ml, Bleu 10ml". */
function describeProducts(combo: Combo): string {
  return (
    combo.comboProducts
      ?.map((cp) => {
        const name = cp.product?.name ?? 'Producto'
        const ml = cp.productVariation?.mlSize
        return ml ? `${name} ${ml}ml` : name
      })
      .join(', ') ?? ''
  )
}

function comboPrice(combo: Combo): number {
  return Number(combo.finalPrice) - (Number(combo.discount) || 0)
}

export default function ComboSearch({ onAddCombo }: ComboSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  // Combo con el selector de versiones abierto (uno a la vez).
  const [openId, setOpenId] = useState<number | null>(null)
  const { data: combos = [], isLoading } = useCombosQuery()

  const filtered = useMemo(() => {
    const active = combos.filter((c) => c.isActive)
    if (!searchTerm) return active
    const lower = searchTerm.toLowerCase()
    return active.filter((c) => c.name.toLowerCase().includes(lower))
  }, [combos, searchTerm])

  /**
   * `variant` es el combo que se vende (el base o una de sus versiones);
   * `base` solo aporta el nombre y la imagen de respaldo. GET /combos
   * devuelve las versiones anidadas, así que sin este paso la venta manual
   * solo podía cobrar la versión base.
   */
  const handleAddCombo = (variant: Combo, base: Combo, optionIndex: number) => {
    const originalPrice =
      variant.comboProducts?.reduce((sum, cp) => {
        const price = Number(
          cp.productVariation?.price ?? cp.product?.price ?? 0,
        )
        return sum + price * cp.quantity
      }, 0) ?? variant.finalPrice

    const hasVersions = (base.versions?.length ?? 0) > 0

    onAddCombo({
      productId: variant.comboProducts?.[0]?.productId ?? 0,
      productVariationId: variant.comboProducts?.[0]?.productVariationId ?? 0,
      comboId: variant.id,
      comboProducts: (variant.comboProducts ?? []).map((cp) => ({
        productId: cp.productVariationId ? undefined : cp.productId,
        productVariationId: cp.productVariationId || undefined,
        quantity: cp.quantity,
      })),
      // Con varias versiones el nombre solo no distingue la línea vendida.
      productName: hasVersions
        ? `COMBO: ${base.name} · Opción ${optionIndex + 1}`
        : `COMBO: ${base.name}`,
      variationLabel: describeProducts(variant),
      imageUrl: variant.imageUrl || base.imageUrl,
      price: comboPrice(variant),
      originalPrice: originalPrice > 0 ? originalPrice : undefined,
    })
    setOpenId(null)
  }

  /** Click en la fila: sin versiones se agrega directo; con versiones abre. */
  const handleRowClick = (combo: Combo) => {
    if ((combo.versions?.length ?? 0) === 0) {
      handleAddCombo(combo, combo, 0)
      return
    }
    setOpenId((id) => (id === combo.id ? null : combo.id))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift size={16} className="text-accent" />
          <h3 className="text-sm font-semibold text-text">
            Combos disponibles
          </h3>
        </div>
        <span className="text-xs text-text-muted">
          {filtered.length} {filtered.length === 1 ? 'combo' : 'combos'}
        </span>
      </div>

      <Input
        placeholder="Buscar combo por nombre..."
        value={searchTerm}
        onValueChange={setSearchTerm}
        startContent={<Search size={16} className="text-text-muted" />}
        size="sm"
        classNames={{
          input: '!text-text',
          inputWrapper: 'bg-bg border border-border',
        }}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Spinner size="sm" color="warning" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-6">
          {searchTerm
            ? 'No hay combos con ese nombre.'
            : 'No hay combos activos.'}
        </p>
      ) : (
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
          {filtered.map((combo) => {
            const finalPrice = comboPrice(combo)
            const hasDiscount = (Number(combo.discount) || 0) > 0
            const variants = [combo, ...(combo.versions ?? [])]
            const hasVersions = variants.length > 1
            const isOpen = openId === combo.id
            return (
              <div key={combo.id} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => handleRowClick(combo)}
                  aria-expanded={hasVersions ? isOpen : undefined}
                  className={`group flex items-center gap-3 border border-border bg-bg p-3 text-left hover:border-accent hover:bg-accent/5 transition-colors ${
                    isOpen ? 'rounded-t-lg border-b-0' : 'rounded-lg'
                  }`}
                >
                  {combo.imageUrl ? (
                    <img
                      src={combo.imageUrl}
                      alt=""
                      className="h-12 w-12 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface text-accent">
                      <Gift size={18} />
                    </div>
                  )}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-medium text-text truncate">
                      {combo.name}
                    </span>
                    <span className="text-xs text-text-muted truncate">
                      {hasVersions
                        ? `${variants.length} versiones · elige una`
                        : `${combo.comboProducts?.length ?? 0} productos · ${
                            combo.comboProducts
                              ?.map((cp) => cp.product?.name)
                              .filter(Boolean)
                              .slice(0, 2)
                              .join(', ') ?? ''
                          }${(combo.comboProducts?.length ?? 0) > 2 ? '...' : ''}`}
                    </span>
                  </div>
                  {!hasVersions && (
                    <div className="flex flex-col items-end shrink-0">
                      {hasDiscount && (
                        <span className="text-[10px] line-through text-text-muted">
                          ${Number(combo.finalPrice).toFixed(2)}
                        </span>
                      )}
                      <span className="text-sm font-bold text-accent">
                        ${finalPrice.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent group-hover:bg-accent group-hover:text-bg transition-colors">
                    {hasVersions ? (
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      />
                    ) : (
                      <Plus size={16} />
                    )}
                  </div>
                </button>

                {/* Versiones del combo: misma línea comercial, otra
                    composición y otro precio. Se cobra la elegida. */}
                {hasVersions && isOpen && (
                  <div className="flex flex-col gap-1.5 rounded-b-lg border border-border bg-surface p-2">
                    {variants.map((variant, i) => (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => handleAddCombo(variant, combo, i)}
                        className="group flex items-center gap-3 rounded-lg border border-border bg-bg p-2.5 text-left hover:border-accent hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-xs font-medium text-text">
                            Opción {i + 1} ·{' '}
                            {variant.comboProducts?.length ?? 0} productos
                          </span>
                          <span className="text-[11px] text-text-muted truncate">
                            {describeProducts(variant) || 'Sin productos'}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-accent shrink-0">
                          ${comboPrice(variant).toFixed(2)}
                        </span>
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent group-hover:bg-accent group-hover:text-bg transition-colors">
                          <Plus size={14} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
