import { useQuery } from '@tanstack/react-query'
import { financeService } from '@/app/features/finance/services/financeService'

export function useFinanceStatsQuery(month?: string) {
  return useQuery({
    queryKey: ['finance-stats', month],
    queryFn: () => financeService.getStats(month),
  })
}

export function useTransactionsQuery() {
  return useQuery({
    queryKey: ['finance-transactions'],
    queryFn: financeService.getTransactions,
  })
}

export function useBillsQuery() {
  return useQuery({
    queryKey: ['finance-bills'],
    queryFn: financeService.getBills,
  })
}
