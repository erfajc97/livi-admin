import { useState, useCallback, useMemo } from 'react'
import { useOrdersQuery } from '@/app/tanstack-queries/ordersQuery'
import {
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from '../mutations/useOrderMutations'
import type { Order, OrderStatus } from '../types'

const ITEMS_PER_PAGE = 10

export type DateFilter = 'all' | 'today' | 'week' | 'month'

function getDateRange(filter: DateFilter): { start: Date; end: Date } | null {
  if (filter === 'all') return null
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  if (filter === 'today') {
    return { start, end: now }
  }
  if (filter === 'week') {
    const weekStart = new Date(start)
    weekStart.setDate(weekStart.getDate() - 7)
    return { start: weekStart, end: now }
  }
  // month
  const monthStart = new Date(start)
  monthStart.setDate(monthStart.getDate() - 30)
  return { start: monthStart, end: now }
}

export function useOrdersPageHook() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)

  const { data: allOrders = [], isLoading } = useOrdersQuery()
  const updateMutation = useUpdateOrderMutation()
  const deleteMutation = useDeleteOrderMutation()

  const filteredOrders = useMemo(() => {
    let result = allOrders

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          (o.userName && o.userName.toLowerCase().includes(q)) ||
          (o.customerName && o.customerName.toLowerCase().includes(q)),
      )
    }

    // Date filter
    const range = getDateRange(dateFilter)
    if (range) {
      result = result.filter((o) => {
        const orderDate = new Date(o.createdAt)
        return orderDate >= range.start && orderDate <= range.end
      })
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter)
    }

    return result
  }, [allOrders, search, dateFilter, statusFilter])

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE)

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredOrders, page])

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const handleDateFilter = useCallback((value: DateFilter) => {
    setDateFilter(value)
    setPage(1)
  }, [])

  const handleStatusFilter = useCallback((value: string) => {
    setStatusFilter(value)
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
    (status: OrderStatus, note?: string) => {
      if (!selectedOrder) return
      updateMutation.mutate(
        { id: selectedOrder.id, payload: { status, statusNote: note } },
        {
          onSuccess: () => {
            setShowStatusModal(false)
            setSelectedOrder(null)
          },
        },
      )
    },
    [selectedOrder, updateMutation],
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
    filteredCount: filteredOrders.length,
    isLoading,
    dateFilter,
    statusFilter,
    selectedOrder,
    showDeleteModal,
    showStatusModal,
    updateMutation,
    deleteMutation,
    handleSearch,
    setPage,
    handleDateFilter,
    handleStatusFilter,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteClose,
    handleStatusClick,
    handleStatusConfirm,
    handleStatusClose,
  }
}
