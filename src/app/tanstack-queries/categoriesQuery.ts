import { useQuery } from '@tanstack/react-query'
import { categoriesService } from '@/app/features/categories/services/categoriesService'
import type { Category } from '@/app/features/categories/types'

export function useCategoriesQuery() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => categoriesService.listCategories(),
  })
}
