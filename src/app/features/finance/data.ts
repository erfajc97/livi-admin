import type { Column } from '@/app/components/UI/table-nextui/CustomTableNextUi'

export const EXPENSE_CATEGORIES = [
  'Proveedor',
  'Marketing',
  'Envíos',
  'Paquetería',
  'Otros',
] as const

export const INCOME_CATEGORIES = ['Venta Online', 'Venta Directa'] as const

export const PAYMENT_METHODS = [
  'Efectivo',
  'Transferencia',
  'Payphone',
  'T. Crédito',
] as const

export const movimientosColumns: Column[] = [
  { key: 'date', name: 'Fecha' },
  { key: 'type', name: 'Tipo' },
  { key: 'category', name: 'Categoría' },
  { key: 'paymentMethod', name: 'Método' },
  { key: 'amount', name: 'Monto' },
  { key: 'status', name: 'Estado' },
  { key: 'description', name: 'Observaciones' },
]

export const CHART_COLORS = {
  income: '#22c55e',
  expense: '#ef4444',
  // Direct hex — CSS vars don't always resolve in SVG `fill` attributes across browsers
  categories: ['#CCB377', '#5B9BD5', '#E05252', '#E8A838', '#8B7EC8'],
} as const
