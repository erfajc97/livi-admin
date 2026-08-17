import { Button } from '@heroui/react'
import { PAYMENT_METHODS as METHODS } from '../data'
import type { PaymentMethod } from '../types'

interface PaymentMethodSelectorProps {
  selected: PaymentMethod
  onChange: (method: PaymentMethod) => void
}

export default function PaymentMethodSelector({
  selected,
  onChange,
}: PaymentMethodSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-base font-semibold text-text">Método de Pago</h3>
      <div className="flex flex-wrap gap-2">
        {METHODS.map((method) => (
          <Button
            key={method.value}
            variant={selected === method.value ? 'solid' : 'bordered'}
            color={selected === method.value ? 'warning' : 'default'}
            onPress={() => onChange(method.value)}
            size="sm"
          >
            {method.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
