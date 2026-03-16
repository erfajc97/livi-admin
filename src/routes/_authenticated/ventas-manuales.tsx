import { createFileRoute } from '@tanstack/react-router'
import { ManualSales } from '@/app/features/manual-sales/ManualSales'

export const Route = createFileRoute('/_authenticated/ventas-manuales')({
  component: ManualSales,
})
