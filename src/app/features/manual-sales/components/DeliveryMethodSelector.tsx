import { Button } from '@heroui/react'
import { DELIVERY_METHODS } from '../data'
import type { DeliveryMethod } from '../types'

interface DeliveryMethodSelectorProps {
  selected: DeliveryMethod
  onChange: (method: DeliveryMethod) => void
}

export default function DeliveryMethodSelector({
  selected,
  onChange,
}: DeliveryMethodSelectorProps) {
  const needsShipment = selected.startsWith('SERVIENTREGA')

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-base font-semibold text-text">Entrega</h3>
      <div className="flex flex-wrap gap-2">
        {DELIVERY_METHODS.map((method) => (
          <Button
            key={method.value}
            variant={selected === method.value ? 'solid' : 'bordered'}
            color={selected === method.value ? 'warning' : 'default'}
            onPress={() => onChange(method.value)}
            size="sm"
          >
            {method.label} · {method.cost === 0 ? 'Gratis' : `$${method.cost.toFixed(2)}`}
          </Button>
        ))}
      </div>
      <p className="text-xs text-text-muted">
        {needsShipment
          ? 'La orden queda en "Pagado". Cuando cargues la guía en el detalle del pedido, al cliente le llega el correo con su tracking.'
          : 'La orden se registra como entregada: se entrega en el momento, sin guía.'}
      </p>
    </div>
  )
}
