import { Input, Select, SelectItem } from '@heroui/react'
import { MEASURE_UNITS } from '../data'
import type { ProductFormData } from '../types'

interface FormSectionInventoryProps {
  formData: ProductFormData
  updateField: <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => void
}

export default function FormSectionInventory({ formData, updateField }: FormSectionInventoryProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-lg font-semibold text-text">Inventario</h3>
      <div className="flex flex-col gap-4">
        <Input
          label="Stock"
          placeholder="0"
          type="number"
          value={formData.stock}
          onValueChange={(v) => updateField('stock', v)}
          classNames={{ label: '!text-text', input: '!text-text', inputWrapper: 'bg-background border-border' }}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Medida"
            placeholder="100"
            type="number"
            value={formData.measureValue}
            onValueChange={(v) => updateField('measureValue', v)}
            classNames={{ label: '!text-text', input: '!text-text', inputWrapper: 'bg-background border-border' }}
          />
          <Select
            label="Unidad"
            selectedKeys={formData.measureUnit ? [formData.measureUnit] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string
              if (value) updateField('measureUnit', value as ProductFormData['measureUnit'])
            }}
            classNames={{ label: '!text-text', trigger: 'bg-background border-border', value: '!text-text', popoverContent: 'bg-surface text-text' }}
          >
            {MEASURE_UNITS.map((u) => (
              <SelectItem key={u.value} classNames={{ base: 'text-text', title: '!text-text' }}>{u.label}</SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
}
