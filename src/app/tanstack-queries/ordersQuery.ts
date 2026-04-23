import { useQuery } from '@tanstack/react-query'
import { ordersService } from '@/app/features/orders/services/ordersService'

export function useOrdersQuery() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: ordersService.getAll,
  })
}

export function useOrderByIdQuery(id: number, enabled = true) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersService.getById(id),
    enabled: enabled && id > 0,
  })
}
