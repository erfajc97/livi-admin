import { Input, Textarea } from '@heroui/react'
import type { ProductFormData } from '../types'

interface FormSectionGeneralProps {
  formData: ProductFormData
  updateField: <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => void
}

export default function FormSectionGeneral({ formData, updateField }: FormSectionGeneralProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-lg font-semibold text-text">Información General</h3>
      <div className="flex flex-col gap-4">
        <Input
          label="Nombre del producto"
          placeholder="Ej: Sauvage Dior"
          value={formData.name}
          onValueChange={(v) => updateField('name', v)}
          classNames={{ label: '!text-text', input: '!text-text', inputWrapper: 'bg-background border-border' }}
          isRequired
        />
        <Input
          label="Marca"
          placeholder="Ej: Dior"
          value={formData.brand}
          onValueChange={(v) => updateField('brand', v)}
          classNames={{ label: '!text-text', input: '!text-text', inputWrapper: 'bg-background border-border' }}
          isRequired
        />
        <Textarea
          label="Descripción"
          placeholder="Descripción detallada del producto..."
          value={formData.description}
          onValueChange={(v) => updateField('description', v)}
          classNames={{ label: '!text-text', input: '!text-text', inputWrapper: 'bg-background border-border' }}
          minRows={4}
        />
      </div>
    </div>
  )
}
