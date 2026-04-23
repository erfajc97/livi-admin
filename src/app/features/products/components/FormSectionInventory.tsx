import { Input } from '@heroui/react'
import type { ProductFormData, Product } from '../types'

interface FormSectionInventoryProps {
  formData: ProductFormData
  updateField: <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => void
  product?: Product | null
}

export default function FormSectionInventory({ formData, updateField, product }: FormSectionInventoryProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-lg font-semibold text-text">Inventario</h3>
      <div className="flex flex-col gap-4">
        <Input
          label="Botellas selladas"
          placeholder="0"
          type="number"
          value={formData.stock}
          onValueChange={(v) => updateField('stock', v)}
          classNames={{ label: '!text-text', input: '!text-text', inputWrapper: 'bg-background border-border' }}
        />
        <Input
          label="ML por botella"
          placeholder="100"
          type="number"
          value={formData.totalMl}
          onValueChange={(v) => updateField('totalMl', v)}
          classNames={{ label: '!text-text', input: '!text-text', inputWrapper: 'bg-background border-border' }}
          isRequired
        />
        {product && (
          <Input
            label="ML Disponible"
            value={String(product.availableMl ?? 0)}
            isReadOnly
            classNames={{ label: '!text-text', input: '!text-text', inputWrapper: 'bg-background border-border opacity-70' }}
            description="Calculado automáticamente por el servidor"
          />
        )}
      </div>
    </div>
  )
}
