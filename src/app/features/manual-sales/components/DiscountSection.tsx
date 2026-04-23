import { Input, Button } from '@heroui/react'
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
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-text">Descuento (opcional)</h3>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={discountType === 'percentage' ? 'solid' : 'flat'}
          color={discountType === 'percentage' ? 'warning' : 'default'}
          onPress={() => onTypeChange('percentage')}
        >
          %
        </Button>
        <Button
          size="sm"
          variant={discountType === 'fixed' ? 'solid' : 'flat'}
          color={discountType === 'fixed' ? 'warning' : 'default'}
          onPress={() => onTypeChange('fixed')}
        >
          $
        </Button>
      </div>
      <Input
        type="number"
        placeholder={discountType === 'percentage' ? 'Ej: 10' : 'Ej: 5.00'}
        value={discountValue}
        onValueChange={onValueChange}
        startContent={<span className="text-text-muted text-sm">{discountType === 'percentage' ? '%' : '$'}</span>}
        classNames={{ input: '!text-text' }}
        size="sm"
      />
    </div>
  )
}
