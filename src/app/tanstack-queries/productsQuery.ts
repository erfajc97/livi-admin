import { useQuery } from '@tanstack/react-query'
import { productsService } from '@/app/features/products/services/productsService'
import type { PaginatedProducts, Product, ProductFilters, Category } from '@/app/features/products/types'

export function useProductsQuery(filters: ProductFilters = {}) {
  return useQuery<PaginatedProducts>({
    queryKey: ['products', filters],
    queryFn: () => productsService.listProducts(filters),
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  })
}

export function useProductByIdQuery(id: number, enabled = true) {
  return useQuery<Product>({
    queryKey: ['products', id],
    queryFn: () => productsService.getProductById(id),
    enabled,
    refetchOnWindowFocus: true,
  })
}

export function useCategoriesQuery() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => productsService.listCategories(),
    staleTime: 60_000,
  })
}
