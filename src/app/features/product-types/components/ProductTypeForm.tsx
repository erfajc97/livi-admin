import { Input, Textarea } from '@heroui/react'
import type { ProductTypeFormData } from '../types'

const inputClasses = { label: '!text-text' }

interface ProductTypeFormProps {
  formData: ProductTypeFormData
  onInputChange: (
    field: keyof ProductTypeFormData,
    value: string | boolean,
  ) => void
}

export default function ProductTypeForm({
  formData,
  onInputChange,
}: ProductTypeFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Nombre"
        labelPlacement="outside"
        placeholder="Ej: Perfume, Decant"
        value={formData.name}
        onValueChange={(v) => onInputChange('name', v)}
        classNames={inputClasses}
        autoComplete="off"
        isRequired
      />
      <Textarea
        label="Descripción"
        labelPlacement="outside"
        placeholder="Descripción del tipo de producto"
        value={formData.description}
        onValueChange={(v) => onInputChange('description', v)}
        classNames={inputClasses}
        autoComplete="off"
      />
    </div>
  )
}
