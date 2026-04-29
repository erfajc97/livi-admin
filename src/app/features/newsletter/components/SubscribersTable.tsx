import { Button, Chip } from '@heroui/react'
import { Trash2Icon } from 'lucide-react'
import { CustomTableNextUi, type Column } from '@/app/components/UI/table-nextui/CustomTableNextUi'
import type { Subscriber } from '../types'

interface SubscribersTableProps {
  subscribers: Subscriber[]
  isLoading: boolean
  onDelete: (subscriber: Subscriber) => void
}

const columns: Column[] = [
  { key: 'email', name: 'Email', sortable: true },
  { key: 'firstName', name: 'Nombre', sortable: true },
  { key: 'isActive', name: 'Estado', align: 'center' },
  { key: 'subscribedAt', name: 'Fecha suscripción', sortable: true },
  { key: 'actions', name: 'Acciones', align: 'center' },
]

export function SubscribersTable({ subscribers, isLoading, onDelete }: SubscribersTableProps) {
  const renderCell = (item: Subscriber, columnKey: string) => {
    switch (columnKey) {
      case 'email':
        return <span className="text-sm text-text">{item.email}</span>
      case 'firstName':
        return (
          <span className="text-sm text-text-muted">
            {item.firstName || '—'}
          </span>
        )
      case 'isActive':
        return (
          <Chip
            size="sm"
            variant="flat"
            color={item.isActive ? 'success' : 'default'}
          >
            {item.isActive ? 'Activo' : 'Inactivo'}
          </Chip>
        )
      case 'subscribedAt':
        return (
          <span className="text-sm text-text-muted">
            {new Date(item.subscribedAt).toLocaleDateString('es-EC', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        )
      case 'actions':
        return (
          <Button
            isIconOnly
            size="sm"
            variant="light"
            color="danger"
            onPress={() => onDelete(item)}
          >
            <Trash2Icon size={16} />
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <CustomTableNextUi
      items={subscribers}
      columns={columns}
      renderCell={renderCell}
      isLoading={isLoading}
      emptyContent="No hay suscriptores registrados"
    />
  )
}
