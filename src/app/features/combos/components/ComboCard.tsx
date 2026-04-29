import { Button, Chip } from '@heroui/react'
import { Pencil, Trash2 } from 'lucide-react'
import type { Combo } from '../types'

interface ComboCardProps {
  combo: Combo
  onEdit: (combo: Combo) => void
  onDelete: (combo: Combo) => void
}

export default function ComboCard({ combo, onEdit, onDelete }: ComboCardProps) {
  const discount = Number(combo.discount) || 0

  return (
    <div className="flex flex-col rounded-xl border border-border bg-surface p-4 gap-4">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          {combo.imageUrl ? (
            <img
              src={combo.imageUrl}
              alt={combo.name}
              className="h-20 w-20 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-bg text-text-muted text-xs">
              Sin imagen
            </div>
          )}
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-text">{combo.name}</h3>
            <Chip size="sm" color={combo.isActive ? 'success' : 'default'} variant="flat">
              {combo.isActive ? 'Activo' : 'Inactivo'}
            </Chip>
          </div>
        </div>
        <div className="flex gap-2">
          <Button isIconOnly size="sm" variant="flat" onPress={() => onEdit(combo)}>
            <Pencil size={16} />
          </Button>
          <Button isIconOnly size="sm" variant="flat" color="danger" onPress={() => onDelete(combo)}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {combo.description && (
        <p className="text-sm text-text-muted line-clamp-2">{combo.description}</p>
      )}

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-text-muted uppercase">Productos incluidos</span>
        <div className="flex flex-wrap gap-2">
          {combo.comboProducts.map((cp) => {
            const isDecant = cp.productVariation && !cp.productVariation.isFullBottle
            return (
              <Chip key={cp.id} size="sm" variant="bordered">
                {cp.product?.name ?? `Producto #${cp.productId}`}
                {isDecant && cp.productVariation?.mlSize && ` (${cp.productVariation.mlSize}ml)`}
                {cp.productVariation?.isFullBottle && ' (Botella completa)'}
                {cp.quantity > 1 && ` x${cp.quantity}`}
              </Chip>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <div className="flex flex-col">
          {discount > 0 && (
            <span className="text-xs text-text-muted line-through">
              ${Number(combo.finalPrice).toFixed(2)}
            </span>
          )}
          <span className="text-xl font-bold text-accent">
            ${(Number(combo.finalPrice) - discount).toFixed(2)}
          </span>
        </div>
        {discount > 0 && (
          <Chip size="sm" color="warning" variant="flat">
            Descuento: ${discount.toFixed(2)}
          </Chip>
        )}
      </div>
    </div>
  )
}
