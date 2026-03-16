import { useState, useCallback, useMemo } from 'react'
import { useOrdersQuery } from '@/app/tanstack-queries/ordersQuery'
import { useUpdateOrderMutation, useDeleteOrderMutation } from '../mutations/useOrderMutations'
import type { Order, OrderStatus } from '../types'

const ITEMS_PER_PAGE = 10

export function useOrdersPageHook() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)

  const { data: allOrders = [], isLoading } = useOrdersQuery()
  const updateMutation = useUpdateOrderMutation()
  const deleteMutation = useDeleteOrderMutation()

  const filteredOrders = useMemo(() => {
    if (!search.trim()) return allOrders
    const q = search.toLowerCase()
    return allOrders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        (o.userName && o.userName.toLowerCase().includes(q))
    )
  }, [allOrders, search])

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredOrders, page])

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const handleDeleteClick = useCallback((order: Order) => {
    setSelectedOrder(order)
    setShowDeleteModal(true)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (!selectedOrder) return
    deleteMutation.mutate(selectedOrder.id, {
      onSuccess: () => {
        setShowDeleteModal(false)
        setSelectedOrder(null)
      },
    })
  }, [selectedOrder, deleteMutation])

  const handleDeleteClose = useCallback(() => {
    setShowDeleteModal(false)
    setSelectedOrder(null)
  }, [])

  const handleStatusClick = useCallback((order: Order) => {
    setSelectedOrder(order)
    setShowStatusModal(true)
  }, [])

  const handleStatusConfirm = useCallback(
    (status: OrderStatus) => {
      if (!selectedOrder) return
      updateMutation.mutate(
        { id: selectedOrder.id, payload: { status } },
        {
          onSuccess: () => {
            setShowStatusModal(false)
            setSelectedOrder(null)
          },
        }
      )
    },
    [selectedOrder, updateMutation]
  )

  const handleStatusClose = useCallback(() => {
    setShowStatusModal(false)
    setSelectedOrder(null)
  }, [])

  return {
    search,
    page,
    totalPages,
    paginatedOrders,
    isLoading,
    selectedOrder,
    showDeleteModal,
    showStatusModal,
    updateMutation,
    deleteMutation,
    handleSearch,
    setPage,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteClose,
    handleStatusClick,
    handleStatusConfirm,
    handleStatusClose,
  }
}
