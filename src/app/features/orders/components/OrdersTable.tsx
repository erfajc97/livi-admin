import { useCallback } from 'react'
import { Button, Chip } from '@heroui/react'
import { Pencil, Trash2 } from 'lucide-react'
import { CustomTableNextUi } from '@/app/components/UI/table-nextui/CustomTableNextUi'
import { CustomPagination } from '@/app/components/UI/table-nextui/CustomPagination'
import { orderColumns, STATUS_LABELS, PAYMENT_STATUS_LABELS } from '../data'
import type { Order } from '../types'

interface OrdersTableProps {
  orders: Order[]
  isLoading: boolean
  page: number
  totalPages: number
  setPage: (page: number) => void
  onEditStatus: (order: Order) => void
  onDelete: (order: Order) => void
  onRowClick?: (order: Order) => void
}

export default function OrdersTable({
  orders,
  isLoading,
  page,
  totalPages,
  setPage,
  onEditStatus,
  onDelete,
  onRowClick,
}: OrdersTableProps) {
  const renderCell = useCallback(
    (item: Order, columnKey: string) => {
      switch (columnKey) {
        case 'orderNumber':
          return <span className="font-medium text-accent">{item.orderNumber}</span>
        case 'customerName':
          return <span className="text-text">{item.customerName || item.userName || 'Cliente'}</span>
        case 'paymentMethod':
          return <span className="text-text-muted">{item.paymentMethod || 'N/A'}</span>
        case 'paymentStatus': {
          const ps = PAYMENT_STATUS_LABELS[item.paymentStatus || 'pending'] || { label: item.paymentStatus || 'N/A', color: 'default' as const }
          return (
            <Chip size="sm" variant="flat" color={ps.color}>
              {ps.label}
            </Chip>
          )
        }
        case 'status': {
          const info = STATUS_LABELS[item.status] || { label: item.status, color: 'default' as const }
          return (
            <Chip size="sm" variant="flat" color={info.color}>
              {info.label}
            </Chip>
          )
        }
        case 'total':
          return <span className="font-semibold">${Number(item.total).toFixed(2)}</span>
        case 'createdAt':
          return (
            <span className="text-xs text-text-muted">
              {new Date(item.createdAt).toLocaleDateString('es-EC', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          )
        case 'actions':
          return (
            <div className="flex gap-2">
              <Button isIconOnly size="sm" variant="light" onPress={() => onEditStatus(item)}>
                <Pencil size={16} className="text-accent" />
              </Button>
              <Button isIconOnly size="sm" variant="light" onPress={() => onDelete(item)}>
                <Trash2 size={16} className="text-danger" />
              </Button>
            </div>
          )
        default: {
          const value = item[columnKey as keyof Order]
          return typeof value === 'string' || typeof value === 'number' ? value : '—'
        }
      }
    },
    [onEditStatus, onDelete]
  )

  return (
    <CustomTableNextUi<Order & { id: string | number }>
      items={orders.map((o) => ({ ...o, id: o.id }))}
      columns={orderColumns}
      renderCell={renderCell}
      onRowClick={onRowClick ? (item) => onRowClick(item as unknown as Order) : undefined}
      isLoading={isLoading}
      emptyContent="No hay órdenes registradas"
      bottomContent={
        <CustomPagination page={page} pages={totalPages} setPage={setPage} isLoading={isLoading} />
      }
    />
  )
}
