import { Input, Switch } from '@heroui/react'
import type { BannerFormData } from '../types'

const inputClasses = { label: '!text-text' }

interface BannerFormProps {
  formData: BannerFormData
  onInputChange: (field: keyof BannerFormData, value: string | boolean) => void
}

export default function BannerForm({ formData, onInputChange }: BannerFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Título"
        labelPlacement="outside"
        placeholder="Ej: Promo Verano"
        value={formData.title}
        onValueChange={(v) => onInputChange('title', v)}
        classNames={inputClasses}
        autoComplete="off"
        isRequired
      />
      <Input
        label="Subtítulo"
        labelPlacement="outside"
        placeholder="Ej: Hasta 50% de descuento"
        value={formData.subtitle}
        onValueChange={(v) => onInputChange('subtitle', v)}
        classNames={inputClasses}
        autoComplete="off"
      />
      <Input
        label="URL de imagen"
        labelPlacement="outside"
        placeholder="Ej: /banners/promo.jpg"
        value={formData.imageUrl}
        onValueChange={(v) => onInputChange('imageUrl', v)}
        classNames={inputClasses}
        autoComplete="off"
      />
      <Input
        label="Link / Acción"
        labelPlacement="outside"
        placeholder="Ej: /catalogo"
        value={formData.link}
        onValueChange={(v) => onInputChange('link', v)}
        classNames={inputClasses}
        autoComplete="off"
      />
      <div className="flex items-center gap-3">
        <Switch
          isSelected={formData.isVisible}
          onValueChange={(v) => onInputChange('isVisible', v)}
          size="sm"
        />
        <span className="text-sm text-text">Visible</span>
      </div>
    </div>
  )
}
