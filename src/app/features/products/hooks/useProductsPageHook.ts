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
  const [deleteConflict, setDeleteConflict] = useState<string | null>(null)
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

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false)
    setSelectedProduct(null)
    setDeleteConflict(null)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (!selectedProduct) return
    deleteMutation.mutate(
      { id: selectedProduct.id },
      {
        onSuccess: closeDeleteModal,
        onError: (error: unknown) => {
          // 409 = el producto ya se vendió. No es un fallo: el backend pide
          // confirmación extra, así que el modal ofrece borrarlo igual.
          const status = (error as { response?: { status?: number } })?.response
            ?.status
          if (status === 409) {
            setDeleteConflict(
              (error as { response?: { data?: { message?: string } } })?.response
                ?.data?.message ?? 'El producto tiene pedidos asociados.',
            )
          }
        },
      },
    )
  }, [selectedProduct, deleteMutation, closeDeleteModal])

  /** Segundo paso tras el 409: borra desvinculando los pedidos. */
  const handleDeleteForce = useCallback(() => {
    if (!selectedProduct) return
    deleteMutation.mutate(
      { id: selectedProduct.id, force: true },
      { onSuccess: closeDeleteModal },
    )
  }, [selectedProduct, deleteMutation, closeDeleteModal])

  const handleDeleteClose = closeDeleteModal

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
    deleteConflict,
    deleteMutation,
    // Handlers
    handleSearch,
    handlePageChange,
    handleCreate,
    handleEdit,
    handleBackToList,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteForce,
    handleDeleteClose,
  }
}
