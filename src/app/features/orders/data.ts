import type { Column } from '@/app/components/UI/table-nextui/CustomTableNextUi'
import type { OrderStatus } from './types'

// Simplified flow: Pendiente → Pagado → Enviado → Entregado
// (Aceptado collapsed into Pagado — admin only flips paymentStatus pending/paid)
export const ORDER_STATUS_OPTIONS: Array<{
  value: OrderStatus
  label: string
  color: 'warning' | 'success' | 'primary' | 'danger' | 'default'
}> = [
  { value: 'order_created', label: 'Pendiente de pago', color: 'warning' },
  { value: 'order_received', label: 'Pagado', color: 'primary' },
  { value: 'order_shipped', label: 'Enviado', color: 'default' },
  { value: 'order_delivered', label: 'Entregado', color: 'success' },
  { value: 'order_delayed', label: 'Retrasado', color: 'warning' },
  { value: 'order_rejected', label: 'Rechazado', color: 'danger' },
  { value: 'order_cancelled', label: 'Cancelado', color: 'danger' },
]

export const STATUS_LABELS: Record<string, { label: string; color: 'warning' | 'success' | 'primary' | 'danger' | 'default' }> = {
  order_created: { label: 'Pendiente de pago', color: 'warning' },
  order_received: { label: 'Pagado', color: 'primary' },
  // Legacy orders may still have order_accepted — surface as Pagado for coherence
  order_accepted: { label: 'Pagado', color: 'primary' },
  order_shipped: { label: 'Enviado', color: 'default' },
  order_delivered: { label: 'Entregado', color: 'success' },
  order_cancelled: { label: 'Cancelado', color: 'danger' },
  order_delayed: { label: 'Retrasado', color: 'warning' },
  order_rejected: { label: 'Rechazado', color: 'danger' },
}

export const PAYMENT_STATUS_LABELS: Record<string, { label: string; color: 'warning' | 'success' | 'danger' | 'default' }> = {
  pending: { label: 'Pendiente', color: 'warning' },
  paid: { label: 'Pagado', color: 'success' },
  failed: { label: 'Fallido', color: 'danger' },
}

export const orderColumns: Column[] = [
  { key: 'orderNumber', name: 'N. Orden' },
  { key: 'customerName', name: 'Cliente' },
  { key: 'paymentMethod', name: 'Método' },
  { key: 'paymentStatus', name: 'Pago' },
  { key: 'status', name: 'Estado' },
  { key: 'total', name: 'Total' },
  { key: 'createdAt', name: 'Fecha' },
  { key: 'actions', name: 'Acciones' },
]
