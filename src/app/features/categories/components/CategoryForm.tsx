import { Input, Textarea, Switch } from '@heroui/react'
import type { CategoryFormData } from '../types'

const inputClasses = { label: '!text-text' }

interface CategoryFormProps {
  formData: CategoryFormData
  imagePreview: string | null
  onInputChange: (
    field: keyof CategoryFormData,
    value: string | boolean,
  ) => void
  onImageChange: (file: File | null) => void
}

export default function CategoryForm({
  formData,
  imagePreview,
  onInputChange,
  onImageChange,
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

      <div>
        <label className="mb-2 block text-sm text-text">
          Imagen de la categoría
        </label>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mb-2 h-28 w-auto rounded-lg object-cover"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onImageChange(e.target.files?.[0] ?? null)}
          className="text-sm text-text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-accent/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-accent hover:file:bg-accent/20"
        />
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
