import OrdersListHeader from './OrdersListHeader'
import OrdersTable from './OrdersTable'
import DeleteOrderModal from './modals/DeleteOrderModal'
import EditOrderStatusModal from './modals/EditOrderStatusModal'
import type { Order, OrderStatus } from '../types'
import type { DateFilter } from '../hooks/useOrdersPageHook'

interface OrdersListViewProps {
  search: string
  orders: Order[]
  isLoading: boolean
  page: number
  totalPages: number
  filteredCount: number
  dateFilter: DateFilter
  statusFilter: string
  selectedOrder: Order | null
  showDeleteModal: boolean
  showStatusModal: boolean
  isDeleting: boolean
  isUpdating: boolean
  onSearch: (value: string) => void
  setPage: (page: number) => void
  onDateFilter: (value: DateFilter) => void
  onStatusFilter: (value: string) => void
  onEditStatus: (order: Order) => void
  onDelete: (order: Order) => void
  onDeleteConfirm: () => void
  onDeleteClose: () => void
  onStatusConfirm: (status: OrderStatus, note?: string) => void
  onStatusClose: () => void
  onRowClick?: (order: Order) => void
}

export default function OrdersListView({
  search,
  orders,
  isLoading,
  page,
  totalPages,
  filteredCount,
  dateFilter,
  statusFilter,
  selectedOrder,
  showDeleteModal,
  showStatusModal,
  isDeleting,
  isUpdating,
  onSearch,
  setPage,
  onDateFilter,
  onStatusFilter,
  onEditStatus,
  onDelete,
  onDeleteConfirm,
  onDeleteClose,
  onStatusConfirm,
  onStatusClose,
  onRowClick,
}: OrdersListViewProps) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <OrdersListHeader
        search={search}
        onSearch={onSearch}
        dateFilter={dateFilter}
        onDateFilter={onDateFilter}
        statusFilter={statusFilter}
        onStatusFilter={onStatusFilter}
        filteredCount={filteredCount}
      />

      <OrdersTable
        orders={orders}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        onEditStatus={onEditStatus}
        onDelete={onDelete}
        onRowClick={onRowClick}
      />

      <DeleteOrderModal
        isOpen={showDeleteModal}
        orderNumber={selectedOrder?.orderNumber ?? ''}
        isLoading={isDeleting}
        onConfirm={onDeleteConfirm}
        onClose={onDeleteClose}
      />

      <EditOrderStatusModal
        isOpen={showStatusModal}
        currentStatus={selectedOrder?.status ?? 'order_created'}
        isLoading={isUpdating}
        onConfirm={onStatusConfirm}
        onClose={onStatusClose}
      />
    </div>
  )
}
