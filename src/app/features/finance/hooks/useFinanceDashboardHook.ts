import { useState, useMemo } from 'react'
import { useFinanceStatsQuery } from '@/app/tanstack-queries/financeQuery'

export function useFinanceDashboardHook() {
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const [month, setMonth] = useState(currentMonth)

  const { data: stats, isLoading } = useFinanceStatsQuery(month)

  const monthLabel = useMemo(() => {
    if (!month) return 'Mes actual'
    const [y, m] = month.split('-')
    const date = new Date(Number(y), Number(m) - 1)
    return date.toLocaleDateString('es-EC', { month: 'long', year: 'numeric' })
  }, [month])

  return {
    month,
    setMonth,
    monthLabel,
    stats,
    isLoading,
  }
}
