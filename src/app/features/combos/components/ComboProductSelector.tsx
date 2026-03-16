import { useState, useMemo } from 'react'
import { Autocomplete, AutocompleteItem } from '@heroui/react'
import { useProductsQuery } from '@/app/tanstack-queries/productsQuery'

interface ComboProductSelectorProps {
  value: string
  onChange: (value: string) => void
}

export default function ComboProductSelector({ value, onChange }: ComboProductSelectorProps) {
  const { data: paginatedData } = useProductsQuery({ limit: 200 })
  const allProducts = paginatedData?.data ?? []
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return allProducts.slice(0, 50)
    const lower = searchTerm.toLowerCase()
    return allProducts
      .filter((p) => p.name.toLowerCase().includes(lower) || p.brand.toLowerCase().includes(lower))
      .slice(0, 50)
  }, [allProducts, searchTerm])

  return (
    <Autocomplete
      label="Producto"
      selectedKey={value}
      inputValue={searchTerm}
      onInputChange={setSearchTerm}
      items={filteredProducts}
      onSelectionChange={(key) => {
        const id = key ? String(key) : ''
        onChange(id)
        if (key) {
          const product = allProducts.find((p) => String(p.id) === String(key))
          if (product) setSearchTerm(product.name)
        }
      }}
      defaultFilter={() => true}
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
          textValue={`${product.name} ${product.brand}`}
          classNames={{ base: 'text-text data-[hover=true]:bg-bg', title: '!text-text' }}
        >
          <div className="flex items-center gap-2">
            {product.imageUrl && (
              <img src={product.imageUrl} alt="" className="h-6 w-6 rounded object-cover" />
            )}
            <div className="flex flex-col">
              <span className="text-sm text-text">{product.name}</span>
              <span className="text-xs text-text-muted">
                {product.brand} — ${product.price}
              </span>
            </div>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  )
}
