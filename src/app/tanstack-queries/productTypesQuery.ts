import { useQuery } from '@tanstack/react-query'
import { productTypesService } from '@/app/features/product-types/services/productTypesService'

export const useProductTypesQuery = () =>
  useQuery({
    queryKey: ['product-types'],
    queryFn: productTypesService.list,
    staleTime: 60_000,
    retry: 1,
  })
