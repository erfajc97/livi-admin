import { useRef } from 'react'
import { Button, Input } from '@heroui/react'
import { Plus, Trash2, ImageIcon, X, AlertTriangle } from 'lucide-react'
import type { VariationRow } from '../types'

interface FormSectionVariationsProps {
  variations: VariationRow[]
  totalMl: number
  productName: string
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
  totalMl,
  productName,
  onAdd,
  onUpdate,
  onRemove,
  onAddImages,
  onRemoveNewImage,
  onRemoveExistingImage,
}: FormSectionVariationsProps) {
  const totalVariationMl = variations.reduce(
    (sum, v) => sum + (Number(v.mlSize) || 0),
    0,
  )
  const mlExceeded = totalMl > 0 && totalVariationMl > totalMl

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">Decants / Variantes</h3>
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

      {/* ML usage bar */}
      {variations.length > 0 && totalMl > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-text-muted">ML usados en variantes</span>
            <span
              className={mlExceeded ? 'text-red-400 font-bold' : 'text-text'}
            >
              {totalVariationMl} / {totalMl} ml
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-background overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${mlExceeded ? 'bg-red-500' : 'bg-accent'}`}
              style={{
                width: `${Math.min((totalVariationMl / totalMl) * 100, 100)}%`,
              }}
            />
          </div>
          {mlExceeded && (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2">
              <AlertTriangle size={14} className="text-red-400 shrink-0" />
              <p className="text-xs text-red-400">
                Las variantes suman <strong>{totalVariationMl}ml</strong> pero
                la botella es de <strong>{totalMl}ml</strong>. Reduce los ML de
                las variantes para no exceder la capacidad de la botella.
              </p>
            </div>
          )}
        </div>
      )}

      {variations.length === 0 ? (
        <p className="text-sm text-text-muted">
          No hay variantes configuradas.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {variations.map((v, i) => (
            <VariationCard
              key={i}
              variation={v}
              index={i}
              productName={productName}
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
  const mlSize = variation.mlSize || ''

  // Auto-generate name and SKU from product name + ml
  const autoName = mlSize ? `${productName} - ${mlSize}ml` : ''
  const autoSku = mlSize
    ? `${productName.replace(/\s+/g, '-').toLowerCase()}-${mlSize}ml`
    : ''

  // If user hasn't manually typed a name/sku, show the auto-generated one as placeholder
  const displayName = variation.name || autoName
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
          label="ML del decant"
          placeholder="10"
          size="sm"
          type="number"
          value={variation.mlSize}
          onValueChange={(val) => onUpdate(index, 'mlSize', val)}
          classNames={inputClasses}
          isRequired
        />
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
          label="Nombre"
          placeholder={autoName || 'Nombre variante'}
          size="sm"
          value={variation.name}
          onValueChange={(val) => onUpdate(index, 'name', val)}
          classNames={inputClasses}
          description={
            !variation.name && autoName ? `Auto: ${autoName}` : undefined
          }
        />
      </div>

      {/* SKU auto-generated — hidden from user, shown as read-only info */}
      <p className="mt-2 text-xs text-text-muted">
        SKU: <span className="font-mono text-text">{displaySku || '—'}</span>
      </p>

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
