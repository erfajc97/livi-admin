import { Input, Textarea, Switch } from '@heroui/react'
import type { CategoryFormData } from '../types'

const inputClasses = { label: '!text-text' }
const fileInputClasses =
  'text-sm text-text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-accent/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-accent hover:file:bg-accent/20'

interface CategoryFormProps {
  formData: CategoryFormData
  imagePreview: string | null
  mobileImagePreview: string | null
  onInputChange: (
    field: keyof CategoryFormData,
    value: string | boolean,
  ) => void
  onImageChange: (file: File | null) => void
  onMobileImageChange: (file: File | null) => void
}

export default function CategoryForm({
  formData,
  imagePreview,
  mobileImagePreview,
  onInputChange,
  onImageChange,
  onMobileImageChange,
}: CategoryFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Nombre"
        labelPlacement="outside"
        placeholder="Ej: Perfumes Árabes"
        value={formData.name}
        onValueChange={(v) => onInputChange('name', v)}
        classNames={inputClasses}
        autoComplete="off"
        isRequired
      />
      <Textarea
        label="Descripción"
        labelPlacement="outside"
        placeholder="Descripción de la categoría"
        value={formData.description}
        onValueChange={(v) => onInputChange('description', v)}
        classNames={inputClasses}
        autoComplete="off"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-text">
            Imagen escritorio
          </label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview escritorio"
              className="mb-2 h-28 w-auto rounded-lg object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onImageChange(e.target.files?.[0] ?? null)}
            className={fileInputClasses}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-text">
            Imagen móvil (opcional)
          </label>
          {mobileImagePreview && (
            <img
              src={mobileImagePreview}
              alt="Preview móvil"
              className="mb-2 h-28 w-auto rounded-lg object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onMobileImageChange(e.target.files?.[0] ?? null)}
            className={fileInputClasses}
          />
          <p className="mt-1 text-xs text-text-muted">
            Si lo dejas vacío se usa el de escritorio.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text">Categoría activa</p>
          <p className="text-xs text-text-muted">Visible en el catálogo</p>
        </div>
        <Switch
          isSelected={formData.isActive}
          onValueChange={(v) => onInputChange('isActive', v)}
          color="success"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text">Bajo pedido</p>
          <p className="text-xs text-text-muted">
            Aparece en la sección Bajo Pedido
          </p>
        </div>
        <Switch
          isSelected={formData.bajoPedido}
          onValueChange={(v) => onInputChange('bajoPedido', v)}
          color="warning"
        />
      </div>
    </div>
  )
}
