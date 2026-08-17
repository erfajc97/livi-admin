import type { DeliveryMethod, PaymentMethod } from './types'

/**
 * Formas de entrega con su costo. El backend cobra estos mismos valores (es su
 * fuente de verdad: `common/constants/delivery-methods.ts`); acá viven solo para
 * mostrar el total antes de registrar la venta.
 */
export const DELIVERY_METHODS: Array<{
  value: DeliveryMethod
  label: string
  cost: number
}> = [
  { value: 'ENTREGA_PERSONAL', label: 'Entrega personal', cost: 0 },
  { value: 'RETIRO_PIWU', label: 'Retiro en Piwu', cost: 2 },
  { value: 'SERVIENTREGA_GYE', label: 'Servientrega GYE', cost: 3 },
  { value: 'SERVIENTREGA_NACIONAL', label: 'Servientrega nacional', cost: 6.5 },
]

export const getDeliveryCost = (method: DeliveryMethod): number =>
  DELIVERY_METHODS.find((m) => m.value === method)?.cost ?? 0

export const PAYMENT_METHODS: Array<{
  value: PaymentMethod
  label: string
}> = [
  { value: 'EFECTIVO', label: 'Efectivo' },
  { value: 'TRANSFERENCIA', label: 'Transferencia' },
  { value: 'TARJETA', label: 'Tarjeta' },
]
