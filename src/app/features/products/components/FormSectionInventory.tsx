import { Input } from '@heroui/react'
import type { ProductFormData, Product, VariationRow } from '../types'

interface FormSectionInventoryProps {
  formData: ProductFormData
  updateField: <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K],
  ) => void
  product?: Product | null
  variations?: VariationRow[]
}

export default function FormSectionInventory({
  formData,
  updateField,
}: FormSectionInventoryProps) {
  // Marcado en rojo solo con valor escrito e inválido.
  const rawStock = formData.stock.trim()
  const stockInvalid =
    rawStock !== '' &&
    (!Number.isInteger(Number(rawStock)) || Number(rawStock) < 0)

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-lg font-semibold text-text">Inventario</h3>

      <div className="flex flex-col gap-4">
        <Input
          label="Unidades en stock"
          placeholder="0"
          type="number"
          min={0}
          value={formData.stock}
          onValueChange={(v) => updateField('stock', v)}
          classNames={{
            label: '!text-text',
            input: '!text-text',
            inputWrapper: 'bg-background border-border',
          }}
          isInvalid={stockInvalid}
          errorMessage={
            stockInvalid ? 'Debe ser un entero de 0 o más.' : undefined
          }
        />
      </div>
    </div>
  )
}
