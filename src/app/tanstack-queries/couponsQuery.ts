import { useQuery } from '@tanstack/react-query'
import { couponsService } from '@/app/features/coupons/services/couponsService'
import type { Coupon } from '@/app/features/coupons/types'

export function useCouponsQuery() {
  return useQuery<Coupon[]>({
    queryKey: ['coupons'],
    queryFn: () => couponsService.listCoupons(),
  })
}
