import { useRef } from 'react'
import { Input, Textarea, Switch, Button } from '@heroui/react'
import type { MarcaFormData } from '../types'

const inputClasses = { label: '!text-text' }

interface MarcaFormProps {
  formData: MarcaFormData
  onInputChange: (field: keyof MarcaFormData, value: string | boolean) => void
  onImageChange: (file: File | null) => void
  onMobileImageChange: (file: File | null) => void
}

export default function MarcaForm({
  formData,
  onInputChange,
  onImageChange,
  onMobileImageChange,
}: MarcaFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mobileFileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onImageChange(file)
  }

  const handleRemoveImage = () => {
    onImageChange(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleRemoveMobileImage = () => {
    onMobileImageChange(null)
    if (mobileFileInputRef.current) mobileFileInputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Nombre"
        labelPlacement="outside"
        placeholder="Ej: Pañaleras de cuero"
        value={formData.name}
        onValueChange={(v) => onInputChange('name', v)}
        classNames={inputClasses}
        autoComplete="off"
        isRequired
      />
      <Textarea
        label="Descripción"
        labelPlacement="outside"
        placeholder="Descripción de la marca"
        value={formData.description}
        onValueChange={(v) => onInputChange('description', v)}
        classNames={inputClasses}
        autoComplete="off"
        description="Se muestra en la página de la marca en el catálogo."
      />

      <div>
        <p className="text-sm font-medium text-text mb-2">Imagen de la marca</p>
        <p className="text-xs text-text-muted mb-3">
          Se muestra como fondo en el banner del catálogo
        </p>

        {formData.imagePreview && (
          <div className="relative mb-3 rounded-lg overflow-hidden border border-border">
            <img
              src={formData.imagePreview}
              alt="Preview"
              className="w-full h-32 object-cover"
            />
            <Button
              size="sm"
              color="danger"
              variant="flat"
              className="absolute top-2 right-2"
              onPress={handleRemoveImage}
            >
              Eliminar
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-surface file:text-accent hover:file:bg-surface/80 file:cursor-pointer cursor-pointer"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-text mb-2">
          Imagen móvil (opcional)
        </p>
        <p className="text-xs text-text-muted mb-3">
          Arte vertical para teléfono. Si lo dejas vacío se usa el de
          escritorio.
        </p>

        {formData.mobileImagePreview && (
          <div className="relative mb-3 rounded-lg overflow-hidden border border-border">
            <img
              src={formData.mobileImagePreview}
              alt="Preview móvil"
              className="w-full h-32 object-cover"
            />
            <Button
              size="sm"
              color="danger"
              variant="flat"
              className="absolute top-2 right-2"
              onPress={handleRemoveMobileImage}
            >
              Eliminar
            </Button>
          </div>
        )}

        <input
          ref={mobileFileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => onMobileImageChange(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-surface file:text-accent hover:file:bg-surface/80 file:cursor-pointer cursor-pointer"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text">Marca activa</p>
          <p className="text-xs text-text-muted">Visible en el catálogo</p>
        </div>
        <Switch
          isSelected={formData.isActive}
          onValueChange={(v) => onInputChange('isActive', v)}
          color="success"
        />
      </div>
    </div>
  )
}
