import { useState, useMemo } from 'react'
import { Autocomplete, AutocompleteItem } from '@heroui/react'
import { Search, ShoppingCart } from 'lucide-react'
import type { Product } from '@/app/features/products/types'
import type { ManualSaleItem } from '../types'

interface ProductSearchProps {
  products: Product[]
  items: ManualSaleItem[]
  onAddItem: (productId: number) => void
}

export default function ProductSearch({ products, items, onAddItem }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products.slice(0, 50)
    const lower = searchTerm.toLowerCase()
    return products
      .filter((p) => p.name.toLowerCase().includes(lower) || p.brand.toLowerCase().includes(lower))
      .slice(0, 50)
  }, [products, searchTerm])

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
      <h3 className="text-base font-semibold text-text">Busca tu producto</h3>

      <Autocomplete
        placeholder="Buscar producto por nombre o marca"
        startContent={<Search size={18} className="text-text-muted" />}
        inputValue={searchTerm}
        onInputChange={setSearchTerm}
        items={filteredProducts}
        onSelectionChange={(key) => {
          if (key) {
            onAddItem(Number(key))
            setSearchTerm('')
          }
        }}
        defaultFilter={() => true}
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
            <div className="flex items-center gap-3">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt="" className="h-8 w-8 rounded object-cover" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded bg-bg text-text-muted text-xs">
                  N/A
                </div>
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

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-text-muted">
          <ShoppingCart size={48} strokeWidth={1} />
          <p className="mt-3 text-sm">Busca y agrega productos para iniciar la venta</p>
        </div>
      ) : null}
    </div>
  )
}
