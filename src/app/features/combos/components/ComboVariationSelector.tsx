import { Select, SelectItem } from '@heroui/react'
import type { ProductVariation, Product } from '@/app/features/products/types'

interface ComboVariationSelectorProps {
  variations: ProductVariation[]
  product?: Product | null
  value: string
  onChange: (value: string) => void
  isLoading?: boolean
}

/** Sentinela: el ítem del combo referencia el producto sin una variante fija. */
const NO_VARIATION_KEY = 'any'

export default function ComboVariationSelector({
  variations,
  product,
  value,
  onChange,
  isLoading = false,
}: ComboVariationSelectorProps) {
  const activeVariations = variations.filter((v) => v.isActive)
  const hasBaseProduct = product && product.price

  if (activeVariations.length === 0 && !hasBaseProduct && !isLoading) {
    return (
      <Select
        label="Variante"
        isDisabled
        placeholder="Sin variantes"
        classNames={{ label: '!text-text', value: '!text-text-muted' }}
        className="min-w-48"
      >
        {[]}
      </Select>
    )
  }

  return (
    <Select
      label="Variante"
      selectedKeys={value ? [value] : []}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0]
        onChange(selected ? String(selected) : '')
      }}
      placeholder="Seleccionar variante"
      isLoading={isLoading}
      classNames={{ label: '!text-text', value: '!text-text' }}
      listboxProps={{
        className: 'bg-surface text-text',
      }}
      popoverProps={{
        classNames: {
          content: 'bg-surface border border-border',
        },
      }}
      className="min-w-48"
    >
      {[
        // Producto base primero (sin color fijo)
        ...(hasBaseProduct
          ? [
              <SelectItem
                key={NO_VARIATION_KEY}
                textValue="Producto base (cualquier color)"
                classNames={{
                  base: 'text-text data-[hover=true]:bg-bg-alt',
                  title: '!text-text',
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text font-semibold">
                    Producto base (cualquier color)
                  </span>
                  <span className="text-xs text-text-muted">
                    ${product.price}
                  </span>
                </div>
              </SelectItem>,
            ]
          : []),
        // Variantes de color
        ...activeVariations.map((v) => (
          <SelectItem
            key={String(v.id)}
            textValue={buildVariationLabel(v)}
            classNames={{
              base: 'text-text data-[hover=true]:bg-bg-alt',
              title: '!text-text',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-text">
                {buildVariationLabel(v)}
              </span>
              {v.price != null && (
                <span className="text-xs text-text-muted">${v.price}</span>
              )}
            </div>
          </SelectItem>
        )),
      ]}
    </Select>
  )
}

function buildVariationLabel(v: ProductVariation): string {
  return v.name || `Variante #${v.id}`
}

export { NO_VARIATION_KEY }
