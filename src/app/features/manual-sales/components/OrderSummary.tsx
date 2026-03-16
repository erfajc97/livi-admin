import { Button } from '@heroui/react'

interface OrderSummaryProps {
  subtotal: number
  discountAmount: number
  total: number
  canSubmit: boolean
  isSubmitting: boolean
  onSubmit: () => void
}

export default function OrderSummary({
  subtotal,
  discountAmount,
  total,
  canSubmit,
  isSubmitting,
  onSubmit,
}: OrderSummaryProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
      <h3 className="text-base font-semibold text-text">Resumen del Pedido</h3>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Subtotal</span>
          <span className="text-text">${subtotal.toFixed(2)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Descuento</span>
            <span className="text-green-400">-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="border-t border-border pt-2">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-text">Total</span>
            <span className="text-xl font-bold text-accent">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Button
        color="warning"
        size="lg"
        onPress={onSubmit}
        isLoading={isSubmitting}
        isDisabled={!canSubmit}
        className="w-full"
      >
        Registrar Venta
      </Button>
    </div>
  )
}
