import { useRef } from 'react'
import { Button, Input } from '@heroui/react'
import { Plus, Trash2, ImageIcon, X } from 'lucide-react'
import type { ProductFormData, VariationRow } from '../types'

interface FormSectionVariationsProps {
  variations: VariationRow[]
  productName: string
  /** Form data — para el campo de tallas que aplica a todas las variantes. */
  formData: ProductFormData
  updateField: <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K],
  ) => void
  onAdd: () => void
  onUpdate: (
    index: number,
    field: keyof VariationRow,
    value: string | boolean,
  ) => void
  onRemove: (index: number) => void
  onAddImages: (varIndex: number, files: File[]) => void
  onRemoveNewImage: (varIndex: number, imgIndex: number) => void
  onRemoveExistingImage: (varIndex: number, imageId: number) => void
}

const inputClasses = {
  label: '!text-text',
  input: '!text-text',
  inputWrapper: 'bg-background border-border',
}

export default function FormSectionVariations({
  variations,
  productName,
  formData,
  updateField,
  onAdd,
  onUpdate,
  onRemove,
  onAddImages,
  onRemoveNewImage,
  onRemoveExistingImage,
}: FormSectionVariationsProps) {
  // Catálogo de tallas del producto: alimenta las sugerencias del campo
  // "Talla" de cada variante (variante = color × talla).
  const productSizes = formData.sizes
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">
          Variantes (color × talla)
        </h3>
        <Button
          size="sm"
          color="warning"
          variant="flat"
          startContent={<Plus size={14} />}
          onPress={onAdd}
        >
          Agregar variante
        </Button>
      </div>

      {/* Catálogo de tallas: NO crea variantes solo — es la lista de donde se
          sugiere la talla al crear cada combinación color × talla. */}
      <div className="mb-4 rounded-lg border border-border/50 bg-bg p-4">
        <Input
          label="Catálogo de tallas del producto (separadas por coma — opcional)"
          placeholder="Midi, Maxi"
          description="Define aquí las tallas del producto; luego, en cada variante, escoges su talla (una variante = color + talla, ej. Negro · Midi). Si el producto es de talla única, deja todo vacío."
          size="sm"
          value={formData.sizes}
          onValueChange={(v) => updateField('sizes', v)}
          classNames={inputClasses}
        />
      </div>

      {variations.length === 0 ? (
        <p className="text-sm text-text-muted">
          No hay variantes configuradas. Agrega una por cada combinación de
          color y talla que vendas (ej. Negro · Midi, Negro · Maxi).
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {variations.map((v, i) => (
            <VariationCard
              key={i}
              variation={v}
              index={i}
              productName={productName}
              productSizes={productSizes}
              onUpdate={onUpdate}
              onRemove={onRemove}
              onAddImages={onAddImages}
              onRemoveNewImage={onRemoveNewImage}
              onRemoveExistingImage={onRemoveExistingImage}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface VariationCardProps {
  variation: VariationRow
  index: number
  productName: string
  /** Catálogo de tallas del producto (sugerencias del input Talla). */
  productSizes: string[]
  onUpdate: (
    index: number,
    field: keyof VariationRow,
    value: string | boolean,
  ) => void
  onRemove: (index: number) => void
  onAddImages: (varIndex: number, files: File[]) => void
  onRemoveNewImage: (varIndex: number, imgIndex: number) => void
  onRemoveExistingImage: (varIndex: number, imageId: number) => void
}

function VariationCard({
  variation,
  index,
  productName,
  productSizes,
  onUpdate,
  onRemove,
  onAddImages,
  onRemoveNewImage,
  onRemoveExistingImage,
}: VariationCardProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const newImagePreviews = (variation.imageFiles ?? []).map((f) =>
    URL.createObjectURL(f),
  )

  // SKU auto-generado: producto + color (+ talla si la variante la tiene)
  const autoSku = variation.name
    ? `${productName.replace(/\s+/g, '-').toLowerCase()}-${variation.name.replace(/\s+/g, '-').toLowerCase()}${variation.size ? `-${variation.size.replace(/\s+/g, '-').toLowerCase()}` : ''}`
    : ''
  const displaySku = variation.sku || autoSku

  return (
    <div className="rounded-lg border border-border/50 bg-bg p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-text">
          Variante {index + 1}
        </span>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          color="danger"
          onPress={() => onRemove(index)}
        >
          <Trash2 size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Input
          label="Color (ej. Negro, Espresso)"
          placeholder="Negro"
          size="sm"
          value={variation.name}
          onValueChange={(val) => onUpdate(index, 'name', val)}
          classNames={inputClasses}
          isRequired
        />
        {/* Talla de la variante — una variante = color + talla. Si el producto
            no tiene tallas, déjalo vacío ("Talla única"). Las sugerencias salen
            del catálogo de tallas de arriba. */}
        <div>
          <Input
            label={productSizes.length ? 'Talla' : 'Talla (opcional — vacío = talla única)'}
            placeholder={productSizes[0] ?? 'Midi'}
            size="sm"
            value={variation.size ?? ''}
            onValueChange={(val) => onUpdate(index, 'size', val)}
            classNames={inputClasses}
            list={`sizes-datalist-${index}`}
          />
          <datalist id={`sizes-datalist-${index}`}>
            {productSizes.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>
        {/* Color del swatch — picker nativo + campo hex. Este valor es el
            que pinta el círculo de color en la tienda. */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-text">Color del swatch</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              aria-label="Elegir color"
              value={/^#[0-9A-Fa-f]{6}$/.test(variation.colorHex ?? '') ? variation.colorHex! : '#231815'}
              onChange={(e) => onUpdate(index, 'colorHex', e.target.value)}
              className="h-9 w-11 cursor-pointer rounded-md border border-border bg-background p-1"
            />
            <Input
              placeholder="#12100E"
              size="sm"
              value={variation.colorHex ?? ''}
              onValueChange={(val) => onUpdate(index, 'colorHex', val)}
              classNames={inputClasses}
            />
          </div>
        </div>
        <Input
          label="Precio"
          placeholder="0.00"
          size="sm"
          type="number"
          value={variation.price}
          onValueChange={(val) => onUpdate(index, 'price', val)}
          startContent={<span className="text-xs text-text-muted">$</span>}
          classNames={inputClasses}
          isRequired
        />
        <Input
          label="SKU (opcional)"
          placeholder={autoSku || 'SKU'}
          size="sm"
          value={variation.sku}
          onValueChange={(val) => onUpdate(index, 'sku', val)}
          classNames={inputClasses}
          description={
            !variation.sku && autoSku ? `Auto: ${autoSku}` : undefined
          }
        />
      </div>

      {/* Variation images */}
      <div className="mt-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">Imagenes de variante</span>
          <Button
            size="sm"
            variant="light"
            className="h-6 min-w-0 px-2 text-xs text-accent"
            startContent={<ImageIcon size={12} />}
            onPress={() => fileRef.current?.click()}
          >
            Agregar
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? [])
              if (files.length > 0) onAddImages(index, files)
              if (fileRef.current) fileRef.current.value = ''
            }}
          />
        </div>

        {((variation.existingImages?.length ?? 0) > 0 ||
          newImagePreviews.length > 0) && (
          <div className="mt-2 flex flex-wrap gap-2">
            {(variation.existingImages ?? []).map((img) => (
              <div key={img.id} className="group relative">
                <img
                  src={img.url}
                  alt=""
                  className="h-16 w-16 rounded object-cover"
                />
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="solid"
                  className="absolute -right-1 -top-1 h-5 w-5 min-w-0 opacity-0 transition group-hover:opacity-100"
                  onPress={() => onRemoveExistingImage(index, img.id)}
                >
                  <X size={10} />
                </Button>
              </div>
            ))}
            {newImagePreviews.map((preview, imgIdx) => (
              <div key={`new-${imgIdx}`} className="group relative">
                <img
                  src={preview}
                  alt=""
                  className="h-16 w-16 rounded object-cover"
                />
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="solid"
                  className="absolute -right-1 -top-1 h-5 w-5 min-w-0 opacity-0 transition group-hover:opacity-100"
                  onPress={() => onRemoveNewImage(index, imgIdx)}
                >
                  <X size={10} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
