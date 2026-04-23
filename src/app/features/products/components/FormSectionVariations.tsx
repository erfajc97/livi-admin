import { useRef } from 'react'
import { Button, Input, Switch } from '@heroui/react'
import { Plus, Trash2, ImageIcon, X } from 'lucide-react'
import type { VariationRow } from '../types'

interface FormSectionVariationsProps {
  variations: VariationRow[]
  onAdd: () => void
  onUpdate: (index: number, field: keyof VariationRow, value: string | boolean) => void
  onRemove: (index: number) => void
  onAddImages: (varIndex: number, files: File[]) => void
  onRemoveNewImage: (varIndex: number, imgIndex: number) => void
  onRemoveExistingImage: (varIndex: number, imageId: number) => void
}

const inputClasses = { label: '!text-text', input: '!text-text', inputWrapper: 'bg-background border-border' }

export default function FormSectionVariations({
  variations,
  onAdd,
  onUpdate,
  onRemove,
  onAddImages,
  onRemoveNewImage,
  onRemoveExistingImage,
}: FormSectionVariationsProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">Variantes del producto</h3>
        <Button size="sm" color="warning" variant="flat" startContent={<Plus size={14} />} onPress={onAdd}>
          Agregar variante
        </Button>
      </div>

      {variations.length === 0 ? (
        <p className="text-sm text-text-muted">No hay variantes configuradas.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {variations.map((v, i) => (
            <VariationCard
              key={i}
              variation={v}
              index={i}
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
  onUpdate: (index: number, field: keyof VariationRow, value: string | boolean) => void
  onRemove: (index: number) => void
  onAddImages: (varIndex: number, files: File[]) => void
  onRemoveNewImage: (varIndex: number, imgIndex: number) => void
  onRemoveExistingImage: (varIndex: number, imageId: number) => void
}

function VariationCard({
  variation,
  index,
  onUpdate,
  onRemove,
  onAddImages,
  onRemoveNewImage,
  onRemoveExistingImage,
}: VariationCardProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const newImagePreviews = (variation.imageFiles ?? []).map((f) => URL.createObjectURL(f))

  return (
    <div className="rounded-lg border border-border/50 bg-bg p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-text">Variante {index + 1}</span>
        <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => onRemove(index)}>
          <Trash2 size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Input
          label="Nombre"
          placeholder="XL - Rojo"
          size="sm"
          value={variation.name}
          onValueChange={(val) => onUpdate(index, 'name', val)}
          classNames={inputClasses}
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
        />
        <Input
          label="ML del decant"
          placeholder="10"
          size="sm"
          type="number"
          value={variation.mlSize}
          onValueChange={(val) => onUpdate(index, 'mlSize', val)}
          classNames={inputClasses}
        />
        <Input
          label="SKU"
          placeholder="SKU-001"
          size="sm"
          value={variation.sku}
          onValueChange={(val) => onUpdate(index, 'sku', val)}
          classNames={inputClasses}
        />
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Switch
          size="sm"
          isSelected={variation.isFullBottle}
          onValueChange={(val) => onUpdate(index, 'isFullBottle', val)}
          classNames={{ label: 'text-sm text-text' }}
        >
          Botella completa
        </Switch>
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

        {((variation.existingImages?.length ?? 0) > 0 || newImagePreviews.length > 0) && (
          <div className="mt-2 flex flex-wrap gap-2">
            {(variation.existingImages ?? []).map((img) => (
              <div key={img.id} className="group relative">
                <img src={img.url} alt="" className="h-16 w-16 rounded object-cover" />
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
                <img src={preview} alt="" className="h-16 w-16 rounded object-cover" />
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
