import { Input } from '@heroui/react'
import type { BannerFormData } from '../types'

const inputClasses = { label: '!text-text' }

interface BannerFormProps {
  formData: BannerFormData
  imagePreview: string | null
  onInputChange: (field: keyof BannerFormData, value: string | boolean) => void
  onImageChange: (file: File | null) => void
}

export default function BannerForm({ formData, imagePreview, onInputChange, onImageChange }: BannerFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Título (opcional)"
        labelPlacement="outside"
        placeholder="Déjalo vacío si la imagen ya trae el texto"
        value={formData.title}
        onValueChange={(v) => onInputChange('title', v)}
        classNames={inputClasses}
        autoComplete="off"
      />
      <Input
        label="Subtítulo (opcional)"
        labelPlacement="outside"
        placeholder="Ej: Hasta 50% de descuento"
        value={formData.subtitle}
        onValueChange={(v) => onInputChange('subtitle', v)}
        classNames={inputClasses}
        autoComplete="off"
      />

      <div>
        <label className="mb-2 block text-sm text-text">Imagen del banner</label>
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="mb-2 h-28 w-auto rounded-lg object-cover" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onImageChange(e.target.files?.[0] ?? null)}
          className="text-sm text-text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-accent/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-accent hover:file:bg-accent/20"
        />
      </div>

      <Input
        label="Link / Acción"
        labelPlacement="outside"
        placeholder="Ej: /catalogo"
        value={formData.link}
        onValueChange={(v) => onInputChange('link', v)}
        classNames={inputClasses}
        autoComplete="off"
      />
      <Input
        label="Texto del botón"
        labelPlacement="outside"
        placeholder="Ej: Ver Catálogo"
        value={formData.buttonText}
        onValueChange={(v) => onInputChange('buttonText', v)}
        classNames={inputClasses}
        autoComplete="off"
      />

    </div>
  )
}
