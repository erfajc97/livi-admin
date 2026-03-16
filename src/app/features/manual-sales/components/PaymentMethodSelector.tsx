import { Button } from '@heroui/react'
import type { PaymentMethod } from '../types'

interface PaymentMethodSelectorProps {
  selected: PaymentMethod
  onChange: (method: PaymentMethod) => void
}

const METHODS: PaymentMethod[] = ['Efectivo', 'Transferencia', 'Tarjeta']

export default function PaymentMethodSelector({ selected, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-base font-semibold text-text">Método de Pago</h3>
      <div className="flex flex-wrap gap-2">
        {METHODS.map((method) => (
          <Button
            key={method}
            variant={selected === method ? 'solid' : 'bordered'}
            color={selected === method ? 'warning' : 'default'}
            onPress={() => onChange(method)}
            size="sm"
          >
            {method}
          </Button>
        ))}
      </div>
    </div>
  )
}
