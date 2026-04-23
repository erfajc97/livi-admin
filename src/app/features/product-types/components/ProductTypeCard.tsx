import { Button, Chip, Switch } from '@heroui/react'
import { PencilIcon, TrashIcon } from 'lucide-react'
import type { ProductType } from '../types'
import { useToggleProductTypeActiveMutation } from '../mutations/useProductTypeMutations'

interface ProductTypeCardProps {
  productType: ProductType
  onEdit: (item: ProductType) => void
  onDelete: (item: ProductType) => void
}

export default function ProductTypeCard({ productType, onEdit, onDelete }: ProductTypeCardProps) {
  const toggleActive = useToggleProductTypeActiveMutation()

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition hover:border-accent/30">
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-text">{productType.name}</h3>
          <Switch
            size="sm"
            color="warning"
            isSelected={productType.isActive}
            isDisabled={toggleActive.isPending}
            onValueChange={(val) =>
              toggleActive.mutate({ id: productType.id, isActive: val })
            }
            aria-label="Estado activo"
          />
          <Chip
            size="sm"
            variant="flat"
            color={productType.isActive ? 'success' : 'default'}
          >
            {productType.isActive ? 'Activo' : 'Inactivo'}
          </Chip>
        </div>
        {productType.description && (
          <p className="mt-1 text-sm text-text-muted">{productType.description}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={() => onEdit(productType)}
          aria-label="Editar tipo"
        >
          <PencilIcon size={16} className="text-text-muted" />
        </Button>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          color="danger"
          onPress={() => onDelete(productType)}
          aria-label="Eliminar tipo"
        >
          <TrashIcon size={16} />
        </Button>
      </div>
    </div>
  )
}
