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

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const renderCell = useCallback(
    (item: Product, columnKey: string) => {
      switch (columnKey) {
        case 'imageUrl': {
          const imgSrc = item.imageUrl || item.images?.[0]?.url
          return imgSrc ? (
            <img
              src={imgSrc}
              alt={item.name}
              className="h-10 w-10 rounded-lg object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-lg bg-surface" />
          )
        }
        case 'name':
          return (
            <div>
              <p className="font-medium text-text">{item.name}</p>
              {item.category && (
                <p className="text-xs text-text-muted">{item.category.name}</p>
              )}
            </div>
          )
        case 'price': {
          const hasDiscount = item.discount && item.discount > 0
          const discountedPrice = hasDiscount
            ? Number(item.price) * (1 - Number(item.discount) / 100)
            : null
          return (
            <div>
              {hasDiscount ? (
                <>
                  <span className="text-xs text-text-muted line-through">
                    ${Number(item.price).toFixed(2)}
                  </span>
                  <span className="ml-1 font-semibold text-success">
                    ${discountedPrice!.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="font-semibold">
                  ${Number(item.price).toFixed(2)}
                </span>
              )}
            </div>
          )
        }
        case 'stock':
          return (
            <Chip
              size="sm"
              variant="flat"
              color={
                item.stock > 10
                  ? 'success'
                  : item.stock > 0
                    ? 'warning'
                    : 'danger'
              }
            >
              {item.stock}
            </Chip>
          )
        case 'category':
          return (
            <div>
              <p className="text-sm font-medium text-text">
                {item.category?.name ?? '—'}
              </p>
              {item.marca && (
                <p className="text-xs text-text-muted">{item.marca.name}</p>
              )}
            </div>
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
        case 'actions':
          return (
            <div className="flex gap-2">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onEdit(item)}
              >
                <Pencil size={16} className="text-accent" />
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onDelete(item)}
              >
                <Trash2 size={16} className="text-danger" />
              </Button>
            </div>
          )
        default: {
          const value = item[columnKey as keyof Product]
          return typeof value === 'string' || typeof value === 'number'
            ? value
            : '—'
        }
      }
    },
    [onEdit, onDelete],
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
