import { Button, Chip } from '@heroui/react'
import { Minus, Plus, Trash2, Gift, Package, ShoppingCart } from 'lucide-react'
import type { ManualSaleItem } from '../types'

interface SaleItemsListProps {
  items: ManualSaleItem[]
  onUpdateQuantity: (itemKey: string, quantity: number) => void
  onRemove: (itemKey: string) => void
}

const itemKey = (item: ManualSaleItem) =>
  item.comboId
    ? `combo-${item.comboId}`
    : item.productVariationId
      ? `var-${item.productVariationId}`
      : `prod-${item.productId}`

export default function SaleItemsList({
  items,
  onUpdateQuantity,
  onRemove,
}: SaleItemsListProps) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0)

  if (items.length === 0) {
    return (
      // Estado vacío: en base blanca `bg-surface/50` era blanco sobre blanco.
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-bg-alt/50 p-8 text-center">
        <ShoppingCart size={32} className="text-text-muted" />
        <div>
          <p className="text-sm font-medium text-text">Carrito vacío</p>
          <p className="text-xs text-text-muted mt-1">
            Busca y agrega productos o combos para iniciar la venta
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-text">
          Carrito
        </h3>
        <Chip size="sm" variant="flat" color="warning">
          {totalQty} {totalQty === 1 ? 'item' : 'items'}
        </Chip>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const key = itemKey(item)
          const isCombo = !!item.comboId
          const lineTotal = item.price * item.quantity

          return (
            <div
              key={key}
              className={`flex flex-col gap-3 rounded-lg p-3 border ${
                isCombo
                  ? 'border-accent/30 bg-accent/5'
                  : 'border-border/50 bg-bg-alt'
              }`}
            >
              <div className="flex items-start gap-3">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="h-12 w-12 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-bg-alt text-text-muted">
                    {isCombo ? <Gift size={20} /> : <Package size={20} />}
                  </div>
                )}

                <div className="flex flex-1 flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isCombo && (
                      <Chip
                        size="sm"
                        variant="flat"
                        color="warning"
                        startContent={<Gift size={10} />}
                        className="h-5 text-[10px]"
                      >
                        COMBO
                      </Chip>
                    )}
                    <span className="text-sm font-medium text-text break-words">
                      {isCombo
                        ? item.productName.replace(/^COMBO:\s*/i, '')
                        : item.productName}
                    </span>
                  </div>
                  {!isCombo && item.variationLabel && (
                    <span className="text-xs text-text-muted mt-0.5">
                      {item.variationLabel}
                    </span>
                  )}
                  {isCombo && item.variationLabel && (
                    <span className="text-xs text-text-muted mt-1 leading-snug">
                      <span className="font-medium text-text-muted">
                        Incluye:
                      </span>{' '}
                      {item.variationLabel}
                    </span>
                  )}
                  <div className="flex items-center gap-2 mt-1.5">
                    {item.originalPrice && item.originalPrice !== item.price ? (
                      <>
                        <span className="text-xs line-through text-text-muted">
                          ${Number(item.originalPrice).toFixed(2)}
                        </span>
                        <span className="text-xs font-semibold text-green-400">
                          ${Number(item.price).toFixed(2)} c/u
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-text-muted">
                        ${Number(item.price).toFixed(2)} c/u
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  className="-mr-1 -mt-1 shrink-0"
                  onPress={() => onRemove(key)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>

              <div className="flex items-center justify-between border-t border-border/40 pt-2">
                <div className="flex items-center gap-1.5">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    className="h-7 w-7 min-w-0"
                    onPress={() => onUpdateQuantity(key, item.quantity - 1)}
                    isDisabled={item.quantity <= 1}
                  >
                    <Minus size={12} />
                  </Button>
                  <span className="w-8 text-center text-sm font-semibold text-text">
                    {item.quantity}
                  </span>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="warning"
                    className="h-7 w-7 min-w-0"
                    onPress={() => onUpdateQuantity(key, item.quantity + 1)}
                  >
                    <Plus size={12} />
                  </Button>
                </div>
                <span className="text-base font-bold text-accent">
                  ${lineTotal.toFixed(2)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3 mt-1">
        <span className="text-sm font-medium text-text-muted">
          Subtotal de items
        </span>
        <span className="text-base font-bold text-text">
          ${subtotal.toFixed(2)}
        </span>
      </div>
    </div>
  )
}
