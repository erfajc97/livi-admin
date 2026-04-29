import { useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { productsService } from '@/app/features/products/services/productsService'
import { inventoryService } from '../services/inventoryService'
import type { Product } from '@/app/features/products/types'
import type { InventoryDetail } from '../types'

export function useInventoryPageHook() {
  const queryClient = useQueryClient()
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const productsQuery = useQuery({
    queryKey: ['products', { page: 1, limit: 100, search: search || undefined }],
    queryFn: () => productsService.listProducts({ page: 1, limit: 100, search: search || undefined }),
    staleTime: 0, // Always refetch when navigating to inventory
    refetchOnMount: 'always',
  })

  const detailQuery = useQuery<InventoryDetail>({
    queryKey: ['inventory', selectedProductId],
    queryFn: () => inventoryService.getDetail(selectedProductId!),
    enabled: selectedProductId !== null,
    staleTime: 0,
    refetchOnMount: 'always',
  })

  const products: Product[] = productsQuery.data?.data ?? []

  const selectProduct = useCallback((id: number) => {
    // Invalidate previous detail cache to force fresh data
    queryClient.invalidateQueries({ queryKey: ['inventory', id] })
    setSelectedProductId(id)
  }, [queryClient])

  const goBackToList = useCallback(() => {
    setSelectedProductId(null)
    queryClient.invalidateQueries({ queryKey: ['products'] })
  }, [queryClient])

  return {
    products,
    isLoadingProducts: productsQuery.isLoading,
    search,
    setSearch,
    selectedProductId,
    selectProduct,
    goBackToList,
    detail: detailQuery.data ?? null,
    isLoadingDetail: detailQuery.isLoading,
  }
}
