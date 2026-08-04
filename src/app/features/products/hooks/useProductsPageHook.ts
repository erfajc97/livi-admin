import { useState, useCallback, useMemo } from 'react'
import {
  useProductsQuery,
  useCategoriesQuery,
} from '@/app/tanstack-queries/productsQuery'
import { useDeleteProductMutation } from '../mutations/useProductMutations'
import type { Product, ProductFilters } from '../types'

export function useProductsPageHook() {
  const [filters, setFilters] = useState<ProductFilters>({ page: 1, limit: 10 })
  const [search, setSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list')

  const { data: paginatedData, isLoading } = useProductsQuery(filters)
  const { data: categories = [] } = useCategoriesQuery()
  const deleteMutation = useDeleteProductMutation()

  // Join products with categories/marcas
  const products = useMemo(() => {
    if (!paginatedData?.data) return []
    return paginatedData.data.map((product) => {
      const category = categories.find((cat) => cat.id === product.categoryId)
      const marca = category?.marcas.find((sub) => sub.id === product.marcaId)
      return {
        ...product,
        category,
        marca,
      }
    })
  }, [paginatedData?.data, categories])

  const total = paginatedData?.total ?? 0
  const totalPages = Math.ceil(total / (filters.limit ?? 10))

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    setFilters((prev) => ({ ...prev, search: value || undefined, page: 1 }))
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  const handleCreate = useCallback(() => {
    setSelectedProduct(null)
    setView('create')
  }, [])

  const handleEdit = useCallback((product: Product) => {
    setSelectedProduct(product)
    setView('edit')
  }, [])

  const handleBackToList = useCallback(() => {
    setSelectedProduct(null)
    setView('list')
  }, [])

  const handleDeleteClick = useCallback((product: Product) => {
    setSelectedProduct(product)
    setShowDeleteModal(true)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (!selectedProduct) return
    deleteMutation.mutate(selectedProduct.id, {
      onSuccess: () => {
        setShowDeleteModal(false)
        setSelectedProduct(null)
      },
    })
  }, [selectedProduct, deleteMutation])

  const handleDeleteClose = useCallback(() => {
    setShowDeleteModal(false)
    setSelectedProduct(null)
  }, [])

  return {
    // State
    view,
    filters,
    search,
    products,
    total,
    totalPages,
    isLoading,
    selectedProduct,
    showDeleteModal,
    deleteMutation,
    // Handlers
    handleSearch,
    handlePageChange,
    handleCreate,
    handleEdit,
    handleBackToList,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteClose,
  }
}
