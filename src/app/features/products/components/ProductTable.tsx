import { useCallback } from 'react'
import { Button, Chip } from '@heroui/react'
import { Pencil, Trash2 } from 'lucide-react'
import { CustomTableNextUi } from '@/app/components/UI/table-nextui/CustomTableNextUi'
import { productColumns } from '../data'
import type { Product } from '../types'

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const renderCell = useCallback(
    (item: Product, columnKey: string) => {
      switch (columnKey) {
        case 'imageUrl':
          return item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-lg bg-surface" />
          )
        case 'name':
          return (
            <div>
              <p className="font-medium text-text">{item.name}</p>
              <p className="text-xs text-text-muted">{item.type}</p>
            </div>
          )
        case 'price':
          return <span className="font-semibold">${Number(item.price).toFixed(2)}</span>
        case 'stock':
          return (
            <Chip size="sm" variant="flat" color={item.stock > 10 ? 'success' : item.stock > 0 ? 'warning' : 'danger'}>
              {item.stock}
            </Chip>
          )
        case 'category':
          return <span className="text-text-muted">ID: {item.categoryId}</span>
        case 'isActive':
          return (
            <Chip size="sm" variant="flat" color={item.isActive ? 'success' : 'default'}>
              {item.isActive ? 'Activo' : 'Inactivo'}
            </Chip>
          )
        case 'actions':
          return (
            <div className="flex gap-2">
              <Button isIconOnly size="sm" variant="light" onPress={() => onEdit(item)}>
                <Pencil size={16} className="text-accent" />
              </Button>
              <Button isIconOnly size="sm" variant="light" onPress={() => onDelete(item)}>
                <Trash2 size={16} className="text-danger" />
              </Button>
            </div>
          )
        default: {
          const value = item[columnKey as keyof Product]
          return typeof value === 'string' || typeof value === 'number' ? value : '—'
        }
      }
    },
    [onEdit, onDelete]
  )

  return (
    <CustomTableNextUi<Product & { id: string | number }>
      items={products.map((p) => ({ ...p, id: p.id }))}
      columns={productColumns}
      renderCell={renderCell}
      emptyContent="No hay productos registrados"
    />
  )
}
