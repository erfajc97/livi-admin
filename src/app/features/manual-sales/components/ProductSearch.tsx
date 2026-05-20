import { useState, useMemo } from 'react'
import { Autocomplete, AutocompleteItem, Button, Spinner } from '@heroui/react'
import { Search } from 'lucide-react'
import axiosInstance from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import type { Product } from '@/app/features/products/types'
import type { ManualSaleItem } from '../types'

interface ProductSearchProps {
  products: Product[]
  items: ManualSaleItem[]
  onAddItem: (item: Omit<ManualSaleItem, 'quantity'>) => void
}

export default function ProductSearch({ products, onAddItem }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedKey, setSelectedKey] = useState<React.Key | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [loadingVariations, setLoadingVariations] = useState(false)

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products.slice(0, 50)
    const lower = searchTerm.toLowerCase()
    return products.filter((p) => p.name.toLowerCase().includes(lower)).slice(0, 50)
  }, [products, searchTerm])

  const handleSelectProduct = async (key: React.Key | null) => {
    if (!key) return
    const productId = Number(key)
    setSearchTerm('')
    setSelectedKey(null) // reset so the same product can be picked again later
    setLoadingVariations(true)
    try {
      const { data } = await axiosInstance.get(`${API_ENDPOINTS.PRODUCTS}/${productId}?includeVariations=true`)
      const fullProduct = data?.data ?? data
      const variations = fullProduct.variations?.filter((v: any) => v.isActive) ?? []
      if (variations.length > 0) {
        setSelectedProduct(fullProduct)
      } else {
        onAddItem({ productId: fullProduct.id, productVariationId: 0, productName: fullProduct.name, variationLabel: 'Base', imageUrl: fullProduct.imageUrl, price: fullProduct.price })
      }
    } catch {
      const product = products.find((p) => p.id === productId)
      if (product) {
        onAddItem({ productId: product.id, productVariationId: 0, productName: product.name, variationLabel: 'Base', imageUrl: product.imageUrl, price: product.price })
      }
    } finally {
      setLoadingVariations(false)
    }
  }

  const handleSelectVariation = (variationId: number) => {
    if (!selectedProduct) return
    const v = selectedProduct.variations?.find((x) => x.id === variationId)
    if (!v) return
    onAddItem({
      productId: selectedProduct.id,
      productVariationId: v.id,
      productName: selectedProduct.name,
      variationLabel: `${v.mlSize}ml ${v.isFullBottle ? 'Botella' : 'Decant'}`,
      imageUrl: selectedProduct.imageUrl,
      price: Number(v.price || selectedProduct.price),
    })
    setSelectedProduct(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Search size={16} className="text-accent" />
        <h3 className="text-sm font-semibold text-text">Buscar producto</h3>
      </div>

      <Autocomplete
        placeholder="Buscar producto por nombre o marca"
        startContent={<Search size={18} className="text-text-muted" />}
        inputValue={searchTerm}
        onInputChange={setSearchTerm}
        selectedKey={selectedKey as any}
        items={filteredProducts}
        onSelectionChange={handleSelectProduct}
        defaultFilter={() => true}
        allowsCustomValue
        inputProps={{ classNames: { label: '!text-text', input: '!text-text' } }}
        listboxProps={{ className: 'bg-surface text-text max-h-64 overflow-y-auto' }}
        popoverProps={{ classNames: { content: 'bg-surface border border-border' } }}
      >
        {(product) => (
          <AutocompleteItem
            key={String(product.id)}
            textValue={product.name}
            classNames={{ base: 'text-text data-[hover=true]:bg-bg', title: '!text-text' }}
          >
            <div className="flex items-center gap-3">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt="" className="h-8 w-8 rounded object-cover" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded bg-bg text-text-muted text-xs">N/A</div>
              )}
              <div className="flex flex-col">
                <span className="text-sm text-text">{product.name}</span>
                <span className="text-xs text-text-muted">
                  {product.variations?.length ? `${product.variations.length} variantes` : `$${product.price}`}
                </span>
              </div>
            </div>
          </AutocompleteItem>
        )}
      </Autocomplete>

      {loadingVariations && (
        <div className="flex items-center justify-center py-6"><Spinner size="sm" color="warning" /><span className="ml-2 text-sm text-text-muted">Cargando variantes...</span></div>
      )}

      {/* Variation picker */}
      {selectedProduct && !loadingVariations && (
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
          <div className="flex items-center gap-3 mb-3">
            {selectedProduct.imageUrl && <img src={selectedProduct.imageUrl} alt="" className="h-10 w-10 rounded object-cover shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text truncate">{selectedProduct.name}</p>
              <p className="text-xs text-text-muted">Selecciona variante para agregar:</p>
            </div>
            <Button size="sm" variant="flat" onPress={() => setSelectedProduct(null)}>Cancelar</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedProduct.variations
              ?.filter((v) => v.isActive)
              .sort((a, b) => Number(b.isFullBottle) - Number(a.isFullBottle) || a.mlSize - b.mlSize)
              .map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleSelectVariation(v.id)}
                  className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                    v.isFullBottle
                      ? 'border-accent/50 bg-accent/10 hover:border-accent'
                      : 'border-border bg-surface hover:border-accent hover:bg-accent/10'
                  }`}
                >
                  <span className="font-medium text-text">
                    {v.mlSize}ml {v.isFullBottle ? '· Botella completa' : '· Decant'}
                  </span>
                  <span className="text-accent text-xs font-semibold">${Number(v.price || selectedProduct.price).toFixed(2)}</span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
