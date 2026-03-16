import { createFileRoute } from '@tanstack/react-router'
import { Ordenes } from '@/app/features/orders/Ordenes'

export const Route = createFileRoute('/_authenticated/ordenes')({
  component: Ordenes,
})
