import { createFileRoute } from '@tanstack/react-router'
import { Combos } from '@/app/features/combos/Combos'

export const Route = createFileRoute('/_authenticated/combos')({
  component: Combos,
})
