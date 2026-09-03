import { Button, Card, CardBody } from '@heroui/react'
import { GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Product } from '../types'

interface SortableSectionProductProps {
  product: Product
  onRemove: (id: number) => void
  isRemoving: boolean
}

export function SortableSectionProduct({
  product,
  onRemove,
  isRemoving,
}: SortableSectionProductProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(product.id) })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Card shadow="sm" className="border border-border">
        <CardBody className="flex flex-row items-center justify-between gap-2 p-3">
          <div
            {...attributes}
            {...listeners}
            className="flex shrink-0 cursor-grab items-center text-text-muted active:cursor-grabbing"
          >
            <GripVertical size={18} />
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-12 w-12 rounded border border-border object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text">{product.name}</p>
              <p className="text-xs text-text-muted">${product.price}</p>
            </div>
          </div>
          <Button
            size="sm"
            color="danger"
            variant="flat"
            onPress={() => onRemove(product.id)}
            isLoading={isRemoving}
          >
            Quitar
          </Button>
        </CardBody>
      </Card>
    </div>
  )
}
