import { Textarea } from '@heroui/react'
import type { ProductFormData } from '../types'

interface FormSectionDetailProps {
  formData: ProductFormData
  updateField: <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => void
}

export default function FormSectionDetail({ formData, updateField }: FormSectionDetailProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-lg font-semibold text-text">Descripción Detallada</h3>
      <div className="flex flex-col gap-4">
        <Textarea
          label="Descripción detallada"
          placeholder="Descripción extendida del producto para la página de detalle..."
          value={formData.detailDescription}
          onValueChange={(v) => updateField('detailDescription', v)}
          classNames={{ label: '!text-text', input: '!text-text', inputWrapper: 'bg-background border-border' }}
          minRows={5}
        />
        <Textarea
          label="Beneficios del producto (uno por línea)"
          placeholder={"Combina notas frescas, especiadas y dulces\nTiene buena duración en la piel\nAdecuado para noches especiales"}
          value={formData.benefits}
          onValueChange={(v) => updateField('benefits', v)}
          classNames={{ label: '!text-text', input: '!text-text', inputWrapper: 'bg-background border-border' }}
          minRows={4}
        />
      </div>
    </div>
  )
}
