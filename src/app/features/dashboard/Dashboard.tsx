import { Spinner } from '@heroui/react'
import { useAuthStore } from '@/app/store/auth/authStore'
import { useDashboardStatsQuery } from '@/app/tanstack-queries/dashboardQuery'
import WelcomeBanner from './components/WelcomeBanner'
import StatsGrid from './components/StatsGrid'

export function Dashboard() {
  const { userName } = useAuthStore()
  const { data: stats, isLoading } = useDashboardStatsQuery()

  return (
    <div className="flex flex-col gap-6 p-6">
      <WelcomeBanner
        userName={userName}
        subtitle="Panel de administración NönDecants"
        useBgImage
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" color="warning" />
        </div>
      ) : stats ? (
        <StatsGrid stats={stats} />
      ) : (
        <p className="text-text-muted">
          No se pudieron cargar las estadísticas.
        </p>
      )}
    </div>
  )
}
