import type { Column } from '@/app/components/UI/table-nextui/CustomTableNextUi'

export const EXPENSE_CATEGORIES = [
  'Proveedor',
  'Marketing',
  'Envíos',
  'Paquetería',
  'Otros',
] as const

export const INCOME_CATEGORIES = [
  'Venta Online',
  'Venta Directa',
] as const

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
  categories: ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)', 'var(--color-chart-5)'],
} as const
