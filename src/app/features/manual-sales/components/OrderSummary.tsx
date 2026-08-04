import { Button } from '@heroui/react'

interface OrderSummaryProps {
  subtotal: number
  discountAmount: number
  total: number
  itemCount?: number
  isSubmitting: boolean
  onSubmit: () => void
}

export default function OrderSummary({
  subtotal,
  discountAmount,
  total,
  itemCount = 0,
  isSubmitting,
  onSubmit,
}: OrderSummaryProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-accent/30 bg-surface p-4 sm:p-5 shadow-sm">
      <h3 className="text-base font-semibold uppercase tracking-wide text-accent">
        Resumen del pedido
      </h3>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Items en carrito</span>
          <span className="text-text font-medium">{itemCount}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Subtotal</span>
          <span className="text-text font-medium">${subtotal.toFixed(2)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Descuento</span>
            <span className="text-green-400 font-medium">
              -${discountAmount.toFixed(2)}
            </span>
          </div>
        )}

        <div className="border-t border-border pt-2 mt-1">
          <div className="flex justify-between items-baseline">
            <span className="text-base font-bold uppercase text-text">
              Total
            </span>
            <span className="text-2xl font-bold text-accent">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <Button
        color="warning"
        size="lg"
        onPress={onSubmit}
        isLoading={isSubmitting}
        isDisabled={itemCount === 0}
        className="w-full font-bold uppercase tracking-wide"
      >
        Registrar venta
      </Button>
    </div>
  )
}
