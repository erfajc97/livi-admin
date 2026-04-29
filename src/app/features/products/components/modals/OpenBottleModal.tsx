import { useState, useMemo } from 'react'
import { Button, Input } from '@heroui/react'
import { Minus, Plus, AlertTriangle } from 'lucide-react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'

interface OpenBottleModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  productName: string
  totalMl: number
  currentStock: number
  variationMlSizes: number[]
  isLoading: boolean
  onConfirm: (mlRemaining: number, note?: string) => void
}

export default function OpenBottleModal({
  isOpen,
  onOpenChange,
  productName,
  totalMl,
  currentStock,
  variationMlSizes,
  isLoading,
  onConfirm,
}: OpenBottleModalProps) {
  const [soldDecants, setSoldDecants] = useState<Record<number, number>>({})
  const [note, setNote] = useState('')

  const totalMlSold = useMemo(() => {
    return Object.entries(soldDecants).reduce((sum, [ml, qty]) => sum + Number(ml) * qty, 0)
  }, [soldDecants])

  const mlRemaining = totalMl - totalMlSold
  const isOverLimit = totalMlSold > totalMl
  const isFullBottle = totalMlSold >= totalMl
  const hasNoSales = totalMlSold === 0

  const updateDecantQty = (ml: number, delta: number) => {
    setSoldDecants((prev) => {
      const current = prev[ml] || 0
      const next = Math.max(0, current + delta)
      // Don't allow the total to exceed totalMl
      const newTotal = totalMlSold + (next - current) * ml
      if (newTotal > totalMl) return prev
      return { ...prev, [ml]: next }
    })
  }

  const handleConfirm = () => {
    if (isOverLimit || isFullBottle) return
    onConfirm(mlRemaining, note.trim() || undefined)
  }

  const handleClose = (open: boolean) => {
    if (!open) {
      setSoldDecants({})
      setNote('')
    }
    onOpenChange(open)
  }

  const hasVariations = variationMlSizes.length > 0
  // Can only confirm if at least 1 decant was sold (partial bottle) OR no variations (open full)
  const canConfirm = !isOverLimit && !isFullBottle && (!hasVariations || totalMlSold > 0)

  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={handleClose}
      size="md"
      isDismissable={!isLoading}
      hideCloseButton={isLoading}
      headerContent={<h3 className="text-lg font-semibold text-text">Abrir botella</h3>}
      footerContent={
        <div className="flex gap-2">
          <Button color="danger" variant="flat" onPress={() => handleClose(false)} isDisabled={isLoading}>
            Cancelar
          </Button>
          <Button color="warning" onPress={handleConfirm} isLoading={isLoading} isDisabled={!canConfirm}>
            Confirmar
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-lg bg-warning/10 border border-warning/30 p-3">
          <p className="text-sm text-text">
            Vas a abrir una botella sellada de <strong>{productName}</strong>.
          </p>
          <p className="text-xs text-text-muted mt-1">
            Stock actual: <strong>{currentStock}</strong> selladas. Despues: <strong>{currentStock - 1}</strong>.
          </p>
        </div>

        {hasVariations ? (
          <>
            <p className="text-sm text-text font-semibold">Decants ya vendidos de esta botella:</p>
            <p className="text-xs text-text-muted -mt-2">
              Selecciona cuantos decants de cada tamaño ya vendiste de esta botella.
            </p>
            <div className="flex flex-col gap-2">
              {variationMlSizes.map((ml) => {
                const qty = soldDecants[ml] || 0
                return (
                  <div key={ml} className="flex items-center justify-between rounded-lg border border-border/50 bg-bg px-3 py-2">
                    <span className="text-sm text-text font-medium">{ml}ml</span>
                    <div className="flex items-center gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onPress={() => updateDecantQty(ml, -1)}
                        isDisabled={qty === 0}
                        className="h-7 w-7 min-w-0"
                      >
                        <Minus size={12} />
                      </Button>
                      <span className="text-sm font-bold text-text w-6 text-center">{qty}</span>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        color="warning"
                        onPress={() => updateDecantQty(ml, 1)}
                        className="h-7 w-7 min-w-0"
                      >
                        <Plus size={12} />
                      </Button>
                      <span className="text-xs text-text-muted w-14 text-right">= {ml * qty}ml</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary */}
            <div className="rounded-lg border border-border p-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Botella completa</span>
                <span className="text-text font-bold">{totalMl}ml</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-text-muted">ML vendidos</span>
                <span className="font-bold text-text">-{totalMlSold}ml</span>
              </div>
              <div className="border-t border-border mt-2 pt-2 flex justify-between text-sm">
                <span className="text-text font-bold">ML restantes en botella</span>
                <span className="text-lg font-bold text-accent">{mlRemaining}ml</span>
              </div>
            </div>

            {isFullBottle && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2">
                <AlertTriangle size={14} className="text-red-400 shrink-0" />
                <p className="text-xs text-red-400">
                  Si vendiste todos los {totalMl}ml, esa botella ya se uso completa.
                  No necesitas abrirla — el sistema la descontara automaticamente al procesar ordenes.
                </p>
              </div>
            )}

            {hasNoSales && (
              <p className="text-xs text-text-muted">
                Selecciona al menos 1 decant vendido para abrir la botella como parcial.
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-text-muted">
            No hay variantes configuradas. Se abrira la botella completa con <strong>{totalMl}ml</strong>.
          </p>
        )}

        <Input
          label="Nota (opcional)"
          placeholder="Ej: Botella abierta para evento"
          size="sm"
          value={note}
          onValueChange={setNote}
          classNames={{ label: '!text-text', input: '!text-text', inputWrapper: 'bg-background border-border' }}
        />
      </div>
    </CustomModalNextUI>
  )
}
