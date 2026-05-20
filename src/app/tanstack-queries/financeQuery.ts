import { useQuery } from '@tanstack/react-query'
import { financeService } from '@/app/features/finance/services/financeService'

export function useFinanceStatsQuery(month?: string) {
  return useQuery({
    queryKey: ['finance-stats', month],
    queryFn: () => financeService.getStats(month),
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  })
}

export function useTransactionsQuery() {
  return useQuery({
    queryKey: ['finance-transactions'],
    queryFn: financeService.getTransactions,
    refetchOnWindowFocus: true,
  })
}

export function useBillsQuery() {
  return useQuery({
    queryKey: ['finance-bills'],
    queryFn: financeService.getBills,
    refetchOnWindowFocus: true,
  })
}

export function usePaymentMethodsQuery() {
  return useQuery({
    queryKey: ['finance-payment-methods'],
    queryFn: financeService.getPaymentMethods,
    refetchOnWindowFocus: true,
  })
}
