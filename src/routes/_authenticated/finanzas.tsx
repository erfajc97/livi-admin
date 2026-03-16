import { createFileRoute } from '@tanstack/react-router'
import { Finanzas } from '@/app/features/finance/Finanzas'

export const Route = createFileRoute('/_authenticated/finanzas')({
  component: Finanzas,
})
