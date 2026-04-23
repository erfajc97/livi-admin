import { useState, useMemo } from 'react'
import { Autocomplete, AutocompleteItem } from '@heroui/react'
import { Search, Gift } from 'lucide-react'
import { useCombosQuery } from '@/app/tanstack-queries/combosQuery'
import type { ManualSaleItem } from '../types'

interface ComboSearchProps {
  onAddCombo: (item: Omit<ManualSaleItem, 'quantity'>) => void
}

export default function ComboSearch({ onAddCombo }: ComboSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { data: combos = [] } = useCombosQuery()

  const filtered = useMemo(() => {
    const active = combos.filter((c) => c.isActive)
    if (!searchTerm) return active.slice(0, 20)
    const lower = searchTerm.toLowerCase()
    return active.filter((c) => c.name.toLowerCase().includes(lower)).slice(0, 20)
  }, [combos, searchTerm])

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2">
        <Gift size={16} className="text-accent" />
        <h3 className="text-sm font-semibold text-text">Agregar combo</h3>
      </div>

      <Autocomplete
        placeholder="Buscar combo..."
        startContent={<Search size={16} className="text-text-muted" />}
        inputValue={searchTerm}
        onInputChange={setSearchTerm}
        items={filtered}
        onSelectionChange={(key) => {
          if (!key) return
          const combo = combos.find((c) => c.id === Number(key))
          if (!combo) return

          const productsDesc = combo.comboProducts?.map((cp) => {
            const name = cp.product?.name ?? 'Producto'
            const ml = cp.productVariation?.mlSize
            return ml ? `${name} ${ml}ml` : name
          }).join(', ') ?? ''

          // Calculate original price (sum of individual products)
          const originalPrice = combo.comboProducts?.reduce((sum, cp) => {
            const price = Number(cp.productVariation?.price ?? cp.product?.price ?? 0)
            return sum + price * cp.quantity
          }, 0) ?? combo.finalPrice

          onAddCombo({
            productId: combo.comboProducts?.[0]?.productId ?? 0,
            productVariationId: combo.comboProducts?.[0]?.productVariationId ?? 0,
            comboId: combo.id,
            productName: `COMBO: ${combo.name}`,
            variationLabel: productsDesc,
            imageUrl: combo.imageUrl,
            price: combo.finalPrice - (combo.discount ?? 0),
            originalPrice: originalPrice > 0 ? originalPrice : undefined,
          })
          setSearchTerm('')
        }}
        defaultFilter={() => true}
        inputProps={{ classNames: { label: '!text-text', input: '!text-text' } }}
        listboxProps={{ className: 'bg-surface text-text max-h-48 overflow-y-auto' }}
        popoverProps={{ classNames: { content: 'bg-surface border border-border' } }}
        size="sm"
      >
        {(combo) => (
          <AutocompleteItem
            key={String(combo.id)}
            textValue={combo.name}
            classNames={{ base: 'text-text data-[hover=true]:bg-bg', title: '!text-text' }}
          >
            <div className="flex items-center gap-3">
              {combo.imageUrl ? (
                <img src={combo.imageUrl} alt="" className="h-8 w-8 rounded object-cover" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded bg-bg text-accent"><Gift size={14} /></div>
              )}
              <div className="flex flex-col">
                <span className="text-sm text-text">{combo.name}</span>
                <span className="text-xs text-text-muted">${combo.finalPrice} · {combo.comboProducts?.length ?? 0} productos</span>
              </div>
            </div>
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  )
}
