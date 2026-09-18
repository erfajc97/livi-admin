import { useRef } from 'react'
import { Button } from '@heroui/react'
import { ChevronLeft, ChevronRight, ImageIcon, Upload, X } from 'lucide-react'
import type { ProductImage } from '../types'

interface FormSectionMediaProps {
  imagePreviews: string[]
  existingImages: ProductImage[]
  onAddFiles: (files: File[]) => void
  onRemoveNew: (index: number) => void
  onRemoveExisting: (imageId: number | string) => void
  onMoveExisting: (imageId: number | string, direction: -1 | 1) => void
}

export default function FormSectionMedia({
  imagePreviews,
  existingImages,
  onAddFiles,
  onRemoveNew,
  onRemoveExisting,
  onMoveExisting,
}: FormSectionMediaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length > 0) onAddFiles(files)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/'),
    )
    if (files.length > 0) onAddFiles(files)
  }

  const hasImages = existingImages.length > 0 || imagePreviews.length > 0

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-1 text-lg font-semibold text-text">
        Imágenes del producto
      </h3>
      <p className="mb-4 text-xs text-text-muted">
        El orden manda: la primera es la que se ve en la tienda y la segunda es
        la que aparece al pasar el mouse. Muévelas con las flechas.
      </p>

      {/* Existing images */}
      {existingImages.length > 0 && (
        <div className="mb-4 grid grid-cols-4 gap-3">
          {existingImages.map((img, i) => (
            <div key={img.id} className="group/img relative">
              <img
                src={img.url}
                alt={img.alt ?? 'Imagen del producto'}
                className="h-28 w-full rounded-lg object-cover bg-bg-alt"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src =
                    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23333" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%23666" font-size="12">Sin imagen</text></svg>'
                }}
              />

              {/* Posición: 1 = principal, 2 = la del hover */}
              <span className="absolute left-1 top-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                {i === 0 ? '1 · Principal' : i === 1 ? '2 · Hover' : i + 1}
              </span>

              <Button
                isIconOnly
                size="sm"
                color="danger"
                variant="solid"
                className="absolute right-1 top-1 opacity-0 transition group-hover/img:opacity-100"
                onPress={() => onRemoveExisting(img.id)}
              >
                <X size={12} />
              </Button>

              <div className="absolute inset-x-1 bottom-1 flex justify-between opacity-0 transition group-hover/img:opacity-100">
                <Button
                  isIconOnly
                  size="sm"
                  variant="solid"
                  isDisabled={i === 0}
                  aria-label="Mover a la izquierda"
                  onPress={() => onMoveExisting(img.id, -1)}
                >
                  <ChevronLeft size={12} />
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  variant="solid"
                  isDisabled={i === existingImages.length - 1}
                  aria-label="Mover a la derecha"
                  onPress={() => onMoveExisting(img.id, 1)}
                >
                  <ChevronRight size={12} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New image previews */}
      {imagePreviews.length > 0 && (
        <div className="mb-4 grid grid-cols-4 gap-3">
          {imagePreviews.map((preview, i) => (
            <div key={i} className="group relative">
              <img
                src={preview}
                alt={`Nueva imagen ${i + 1}`}
                className="h-28 w-full rounded-lg object-cover"
              />
              <Button
                isIconOnly
                size="sm"
                color="danger"
                variant="solid"
                className="absolute right-1 top-1 opacity-0 transition group-hover:opacity-100"
                onPress={() => onRemoveNew(i)}
              >
                <X size={12} />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-bg-alt p-6 transition hover:border-accent/50"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {hasImages ? (
          <Upload size={24} className="text-text-muted" />
        ) : (
          <ImageIcon size={40} className="text-text-muted" />
        )}
        <p className="mt-2 text-sm text-text-muted">
          {hasImages
            ? 'Agregar más imágenes'
            : 'Arrastra imágenes o haz clic para seleccionar'}
        </p>
        <p className="mt-1 text-xs text-text-muted">Máximo 10 imágenes</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  )
}
