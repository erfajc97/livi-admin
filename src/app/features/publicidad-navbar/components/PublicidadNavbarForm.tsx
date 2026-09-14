import { Input, Textarea } from '@heroui/react'
import type { BannerFormData } from '@/app/features/banners/types'

const inputClasses = { label: '!text-text' }

interface PublicidadNavbarFormProps {
  formData: BannerFormData
  imagePreview: string | null
  onInputChange: (field: keyof BannerFormData, value: string | boolean) => void
  onImageChange: (file: File | null) => void
}

/**
 * Formulario de la publicidad del navbar (panel "Destacado" del mega menú).
 * Reutiliza el modelo de banners con type='navbar': nombre, descripción,
 * imagen (subida a S3) y link/ruta de direccionamiento (igual que el botón del hero).
 */
export default function PublicidadNavbarForm({
  formData,
  imagePreview,
  onInputChange,
  onImageChange,
}: PublicidadNavbarFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Nombre / Título"
        labelPlacement="outside"
        placeholder="Ej: Parfums de Marly"
        value={formData.title}
        onValueChange={(v) => onInputChange('title', v)}
        classNames={inputClasses}
        autoComplete="off"
        isRequired
      />
      <Textarea
        label="Descripción"
        labelPlacement="outside"
        placeholder="Ej: Envío gratis en pedidos sobre $99"
        value={formData.subtitle}
        onValueChange={(v) => onInputChange('subtitle', v)}
        classNames={inputClasses}
        minRows={2}
        maxRows={5}
      />

      <div>
        <label className="mb-2 block text-sm text-text">Imagen del panel</label>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mb-2 h-32 w-auto rounded-lg object-cover"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onImageChange(e.target.files?.[0] ?? null)}
          className="text-sm text-text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-accent/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-accent hover:file:bg-accent/20"
        />
        <p className="mt-1 text-xs text-text-muted">
          Recomendado vertical/cuadrada — se muestra como panel destacado en el
          mega menú.
        </p>
      </div>

      <Input
        label="Link / Ruta de direccionamiento"
        labelPlacement="outside"
        placeholder="Ej: /tienda?categoria=2"
        value={formData.link}
        onValueChange={(v) => onInputChange('link', v)}
        classNames={inputClasses}
        autoComplete="off"
        description="Misma lógica que el botón del hero: a dónde lleva al hacer clic."
      />
    </div>
  )
}
