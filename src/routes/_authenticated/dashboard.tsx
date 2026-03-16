import { createFileRoute } from '@tanstack/react-router'
import { DashboardMetrics } from '@/app/features/dashboard/DashboardMetrics'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardMetrics,
})
