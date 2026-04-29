import { Select, SelectItem, Chip } from '@heroui/react'
import type { ProductVariation, Product } from '@/app/features/products/types'

interface ComboVariationSelectorProps {
  variations: ProductVariation[]
  product?: Product | null
  value: string
  onChange: (value: string) => void
  isLoading?: boolean
}

const FULL_BOTTLE_KEY = 'full-bottle'

export default function ComboVariationSelector({
  variations,
  product,
  value,
  onChange,
  isLoading = false,
}: ComboVariationSelectorProps) {
  const activeVariations = variations.filter((v) => v.isActive)
  const hasFullBottle = product && product.price && product.totalMl

  if (activeVariations.length === 0 && !hasFullBottle && !isLoading) {
    return (
      <Select
        label="Variación"
        isDisabled
        placeholder="Sin variaciones"
        classNames={{ label: '!text-text', value: '!text-text-muted' }}
        className="min-w-48"
      >
        {[]}
      </Select>
    )
  }

  return (
    <Select
      label="Variación"
      selectedKeys={value ? [value] : []}
      onSelectionChange={(keys) => {
        const selected = Array.from(keys)[0]
        onChange(selected ? String(selected) : '')
      }}
      placeholder="Seleccionar variación"
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
        // Full bottle option first
        ...(hasFullBottle
          ? [
              <SelectItem
                key={FULL_BOTTLE_KEY}
                textValue={`Botella completa — ${product.totalMl}ml`}
                classNames={{ base: 'text-text data-[hover=true]:bg-bg', title: '!text-text' }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text font-semibold">Botella completa — {product.totalMl}ml</span>
                  <span className="text-xs text-text-muted">${product.price}</span>
                  <Chip size="sm" variant="flat" color="warning" className="text-xs">
                    Sellada
                  </Chip>
                </div>
              </SelectItem>,
            ]
          : []),
        // Decant variations
        ...activeVariations.map((v) => (
          <SelectItem
            key={String(v.id)}
            textValue={buildVariationLabel(v)}
            classNames={{ base: 'text-text data-[hover=true]:bg-bg', title: '!text-text' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-text">{buildVariationLabel(v)}</span>
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
  if (v.name) return `${v.name} — ${v.mlSize}ml`
  return `${v.mlSize}ml Decant`
}

export { FULL_BOTTLE_KEY }
