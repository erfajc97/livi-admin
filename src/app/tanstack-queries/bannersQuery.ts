import { useQuery } from '@tanstack/react-query'
import { bannersService } from '@/app/features/banners/services/bannersService'
import type { Banner } from '@/app/features/banners/types'

export function useBannersQuery() {
  return useQuery<Banner[]>({
    queryKey: ['banners'],
    queryFn: () => bannersService.listBanners(),
  })
}
