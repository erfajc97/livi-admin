import { Input } from '@heroui/react'
import type { BannerFormData } from '../types'
import BannerImageField from './BannerImageField'

const inputClasses = { label: '!text-text' }

interface BannerFormProps {
  formData: BannerFormData
  imagePreview: string | null
  mobileImagePreview: string | null
  onInputChange: (field: keyof BannerFormData, value: string | boolean) => void
  onImageChange: (file: File | null) => void
  onMobileImageChange: (file: File | null) => void
}

export default function BannerForm({
  formData,
  imagePreview,
  mobileImagePreview,
  onInputChange,
  onImageChange,
  onMobileImageChange,
}: BannerFormProps) {
  return (
    <div className="flex min-w-0 flex-col gap-4">
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

      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <BannerImageField
          label="Imagen escritorio"
          hint="Arte horizontal, para pantallas grandes."
          preview={imagePreview}
          previewAlt="Preview escritorio"
          onChange={onImageChange}
        />
        <BannerImageField
          label="Imagen móvil (opcional)"
          hint="Arte vertical para teléfono. Si lo dejas vacío se usa el de escritorio."
          preview={mobileImagePreview}
          previewAlt="Preview móvil"
          onChange={onMobileImageChange}
        />
      </div>

      <Input
        label="Link / Acción"
        labelPlacement="outside"
        placeholder="Ej: /tienda"
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
