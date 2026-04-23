import { useState, useMemo } from 'react'
import { Autocomplete, AutocompleteItem } from '@heroui/react'
import { useProductsQuery } from '@/app/tanstack-queries/productsQuery'
import type { Product } from '@/app/features/products/types'

interface ComboProductSelectorProps {
  value: string
  onChange: (value: string) => void
  onProductSelected?: (product: Product | null) => void
}

export default function ComboProductSelector({
  value,
  onChange,
  onProductSelected,
}: ComboProductSelectorProps) {
  const { data: paginatedData, isLoading } = useProductsQuery({ page: 1, limit: 100 })
  const allProducts = paginatedData?.data ?? []

  return (
    <Autocomplete
      label="Producto"
      selectedKey={value || null}
      items={allProducts}
      isLoading={isLoading}
      onSelectionChange={(key) => {
        const id = key ? String(key) : ''
        onChange(id)
        if (key) {
          const product = allProducts.find((p) => String(p.id) === String(key))
          if (product) {
            onProductSelected?.(product)
          }
        } else {
          onProductSelected?.(null)
        }
      }}
      classNames={{
        base: 'flex-1',
      }}
      inputProps={{
        classNames: {
          label: '!text-text',
          input: '!text-text',
        },
      }}
      listboxProps={{
        className: 'bg-surface text-text max-h-64 overflow-y-auto',
        emptyContent: isLoading ? "Cargando productos..." : "No se encontraron productos.",
      }}
      popoverProps={{
        classNames: {
          content: 'bg-surface border border-border',
        },
      }}
    >
      {(product) => (
        <AutocompleteItem
          key={String(product.id)}
          textValue={product.name}
          classNames={{ base: 'text-text data-[hover=true]:bg-bg', title: '!text-text' }}
        >
          <div className="flex items-center gap-2">
            {product.imageUrl && (
              <img src={product.imageUrl} alt="" className="h-6 w-6 rounded object-cover" />
            )}
            <div className="flex flex-col">
              <span className="text-sm text-text">{product.name}</span>
              <span className="text-xs text-text-muted">
                ${product.price}
              </span>
            </div>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  )
}
