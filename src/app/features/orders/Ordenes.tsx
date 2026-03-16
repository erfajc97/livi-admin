import { useOrdersPageHook } from './hooks/useOrdersPageHook'
import OrdersListView from './components/OrdersListView'

export function Ordenes() {
  const hook = useOrdersPageHook()

  return (
    <OrdersListView
      search={hook.search}
      orders={hook.paginatedOrders}
      isLoading={hook.isLoading}
      page={hook.page}
      totalPages={hook.totalPages}
      selectedOrder={hook.selectedOrder}
      showDeleteModal={hook.showDeleteModal}
      showStatusModal={hook.showStatusModal}
      isDeleting={hook.deleteMutation.isPending}
      isUpdating={hook.updateMutation.isPending}
      onSearch={hook.handleSearch}
      setPage={hook.setPage}
      onEditStatus={hook.handleStatusClick}
      onDelete={hook.handleDeleteClick}
      onDeleteConfirm={hook.handleDeleteConfirm}
      onDeleteClose={hook.handleDeleteClose}
      onStatusConfirm={hook.handleStatusConfirm}
      onStatusClose={hook.handleStatusClose}
    />
  )
}
