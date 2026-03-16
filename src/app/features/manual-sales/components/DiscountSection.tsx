import { Input, RadioGroup, Radio } from '@heroui/react'
import type { DiscountType } from '../types'

interface DiscountSectionProps {
  discountType: DiscountType
  discountValue: string
  onTypeChange: (type: DiscountType) => void
  onValueChange: (value: string) => void
}

export default function DiscountSection({
  discountType,
  discountValue,
  onTypeChange,
  onValueChange,
}: DiscountSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-base font-semibold text-text">Descuento General</h3>

      <RadioGroup
        value={discountType}
        onValueChange={(v) => onTypeChange(v as DiscountType)}
        classNames={{ label: '!text-text' }}
      >
        <Radio value="percentage" classNames={{ label: '!text-text' }}>
          % Porcentaje (%)
        </Radio>
        <Radio value="fixed" classNames={{ label: '!text-text' }}>
          $ Monto fijo ($)
        </Radio>
        <Radio value="per_product" classNames={{ label: '!text-text' }}>
          Fijo por Producto
        </Radio>
      </RadioGroup>

      <div>
        <label className="mb-1 block text-sm font-medium text-text">Monto a descontar</label>
        <Input
          type="number"
          value={discountValue}
          onValueChange={onValueChange}
          classNames={{ label: '!text-text', input: '!text-text' }}
        />
      </div>
    </div>
  )
}
