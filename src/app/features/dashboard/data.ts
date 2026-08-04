import type { Column } from '@/app/components/UI/table-nextui/CustomTableNextUi'

export const STATUS_LABELS: Record<
  string,
  {
    label: string
    color: 'warning' | 'success' | 'primary' | 'danger' | 'default'
  }
> = {
  order_created: { label: 'Pendiente de pago', color: 'warning' },
  order_received: { label: 'Pagado', color: 'primary' },
  order_accepted: { label: 'Pagado', color: 'primary' },
  order_shipped: { label: 'Enviado', color: 'default' },
  order_delivered: { label: 'Entregado', color: 'success' },
  order_cancelled: { label: 'Cancelado', color: 'danger' },
  order_delayed: { label: 'Retrasado', color: 'warning' },
  order_rejected: { label: 'Rechazado', color: 'danger' },
}

export const recentOrderColumns: Column[] = [
  { key: 'orderNumber', name: 'Ordenes' },
  { key: 'clientName', name: 'Cliente' },
  { key: 'paymentMethod', name: 'Pago' },
  { key: 'status', name: 'Estado' },
  { key: 'total', name: 'Total' },
]
