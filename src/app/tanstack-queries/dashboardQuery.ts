import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/app/features/dashboard/services/dashboardService'
import type { DashboardStats } from '@/app/features/dashboard/types'

export function useDashboardStatsQuery() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
    staleTime: 30_000,
  })
}
