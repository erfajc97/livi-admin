import { useState, useMemo } from 'react'
import { Autocomplete, AutocompleteItem, Button, Spinner } from '@heroui/react'
import { Search, ShoppingCart } from 'lucide-react'
import axiosInstance from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import type { Product } from '@/app/features/products/types'
import type { ManualSaleItem } from '../types'

interface ProductSearchProps {
  products: Product[]
  items: ManualSaleItem[]
  onAddItem: (item: Omit<ManualSaleItem, 'quantity'>) => void
}

export default function ProductSearch({ products, items, onAddItem }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
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
    setLoadingVariations(true)
    try {
      // Fetch product with variations from API
      const { data } = await axiosInstance.get(`${API_ENDPOINTS.PRODUCTS}/${productId}`)
      const fullProduct = data?.data ?? data
      const variations = fullProduct.variations?.filter((v: any) => v.isActive) ?? []
      if (variations.length > 0) {
        setSelectedProduct(fullProduct)
      } else {
        onAddItem({ productId: fullProduct.id, productVariationId: 0, productName: fullProduct.name, variationLabel: 'Base', imageUrl: fullProduct.imageUrl, price: fullProduct.price })
      }
    } catch {
      // Fallback to local product data
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
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
      <h3 className="text-base font-semibold text-text">Busca tu producto</h3>

      <Autocomplete
        placeholder="Buscar producto por nombre o marca"
        startContent={<Search size={18} className="text-text-muted" />}
        inputValue={searchTerm}
        onInputChange={setSearchTerm}
        items={filteredProducts}
        onSelectionChange={handleSelectProduct}
        defaultFilter={() => true}
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
            {selectedProduct.imageUrl && <img src={selectedProduct.imageUrl} alt="" className="h-10 w-10 rounded object-cover" />}
            <div>
              <p className="text-sm font-semibold text-text">{selectedProduct.name}</p>
              <p className="text-xs text-text-muted">Selecciona una variante:</p>
            </div>
            <Button size="sm" variant="flat" className="ml-auto" onPress={() => setSelectedProduct(null)}>Cancelar</Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {selectedProduct.variations?.filter((v) => v.isActive).map((v) => (
              <button
                key={v.id}
                onClick={() => handleSelectVariation(v.id)}
                className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-sm hover:border-accent hover:bg-accent/10 transition-colors"
              >
                <span className="font-medium text-text">{v.mlSize}ml {v.isFullBottle ? 'Botella' : 'Decant'}</span>
                <span className="text-text-muted text-xs">${Number(v.price || selectedProduct.price).toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 && !selectedProduct && (
        <div className="flex flex-col items-center justify-center py-12 text-text-muted">
          <ShoppingCart size={48} strokeWidth={1} />
          <p className="mt-3 text-sm">Busca y agrega productos para iniciar la venta</p>
        </div>
      )}
    </div>
  )
}
