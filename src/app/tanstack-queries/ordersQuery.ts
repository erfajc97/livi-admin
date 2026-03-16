import { useQuery } from '@tanstack/react-query'
import { ordersService } from '@/app/features/orders/services/ordersService'

export function useOrdersQuery() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: ordersService.getAll,
  })
}
