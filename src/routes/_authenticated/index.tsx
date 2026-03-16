import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@/app/features/dashboard/Dashboard'

export const Route = createFileRoute('/_authenticated/')({
  component: Dashboard,
})
