import { useState } from 'react'
import { useOrdersPageHook } from './hooks/useOrdersPageHook'
import OrdersListView from './components/OrdersListView'
import OrderDetailView from './components/OrderDetailView'

export function Ordenes() {
  const hook = useOrdersPageHook()
  const [detailOrderId, setDetailOrderId] = useState<number | null>(null)

  if (detailOrderId) {
    return (
      <OrderDetailView
        orderId={detailOrderId}
        onBack={() => setDetailOrderId(null)}
      />
    )
  }

  return (
    <OrdersListView
      search={hook.search}
      orders={hook.paginatedOrders}
      isLoading={hook.isLoading}
      page={hook.page}
      totalPages={hook.totalPages}
      filteredCount={hook.filteredCount}
      dateFilter={hook.dateFilter}
      statusFilter={hook.statusFilter}
      selectedOrder={hook.selectedOrder}
      showDeleteModal={hook.showDeleteModal}
      showStatusModal={hook.showStatusModal}
      isDeleting={hook.deleteMutation.isPending}
      isUpdating={hook.updateMutation.isPending}
      onSearch={hook.handleSearch}
      setPage={hook.setPage}
      onDateFilter={hook.handleDateFilter}
      onStatusFilter={hook.handleStatusFilter}
      onEditStatus={hook.handleStatusClick}
      onDelete={hook.handleDeleteClick}
      onDeleteConfirm={hook.handleDeleteConfirm}
      onDeleteClose={hook.handleDeleteClose}
      onStatusConfirm={hook.handleStatusConfirm}
      onStatusClose={hook.handleStatusClose}
      onRowClick={(order) => setDetailOrderId(order.id)}
    />
  )
}
