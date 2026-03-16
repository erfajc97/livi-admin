import OrdersListHeader from './OrdersListHeader'
import OrdersTable from './OrdersTable'
import DeleteOrderModal from './modals/DeleteOrderModal'
import EditOrderStatusModal from './modals/EditOrderStatusModal'
import type { Order, OrderStatus } from '../types'

interface OrdersListViewProps {
  search: string
  orders: Order[]
  isLoading: boolean
  page: number
  totalPages: number
  selectedOrder: Order | null
  showDeleteModal: boolean
  showStatusModal: boolean
  isDeleting: boolean
  isUpdating: boolean
  onSearch: (value: string) => void
  setPage: (page: number) => void
  onEditStatus: (order: Order) => void
  onDelete: (order: Order) => void
  onDeleteConfirm: () => void
  onDeleteClose: () => void
  onStatusConfirm: (status: OrderStatus) => void
  onStatusClose: () => void
}

export default function OrdersListView({
  search,
  orders,
  isLoading,
  page,
  totalPages,
  selectedOrder,
  showDeleteModal,
  showStatusModal,
  isDeleting,
  isUpdating,
  onSearch,
  setPage,
  onEditStatus,
  onDelete,
  onDeleteConfirm,
  onDeleteClose,
  onStatusConfirm,
  onStatusClose,
}: OrdersListViewProps) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <OrdersListHeader search={search} onSearch={onSearch} />

      <OrdersTable
        orders={orders}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        onEditStatus={onEditStatus}
        onDelete={onDelete}
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
