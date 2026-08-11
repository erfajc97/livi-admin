import { useState } from 'react'
import { Button, Input } from '@heroui/react'
import { useQueryClient } from '@tanstack/react-query'
import { Package, Droplets, FlaskConical, Scissors } from 'lucide-react'
import { useOpenBottleMutation } from '../mutations/useProductMutations'
import OpenBottleModal from './modals/OpenBottleModal'
import type { ProductFormData, Product, VariationRow } from '../types'

interface FormSectionInventoryProps {
  formData: ProductFormData
  updateField: <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K],
  ) => void
  product?: Product | null
  variations?: VariationRow[]
}

export default function FormSectionInventory({
  formData,
  updateField,
  product,
  variations = [],
}: FormSectionInventoryProps) {
  const queryClient = useQueryClient()
  const stock = Number(formData.stock) || 0
  const totalMl = Number(formData.totalMl) || 0
  const openMl = product?.openBottleMlRemaining ?? 0
  const availableMl = openMl + stock * totalMl

  // Marcado en rojo solo con valor escrito e inválido.
  const rawStock = formData.stock.trim()
  const stockInvalid =
    rawStock !== '' &&
    (!Number.isInteger(Number(rawStock)) || Number(rawStock) < 0)
  const totalMlInvalid =
    formData.totalMl.trim() !== '' && !(Number(formData.totalMl) > 0)

  const [openBottleModal, setOpenBottleModal] = useState(false)
  const openBottleMutation = useOpenBottleMutation()

  const refreshProduct = () => {
    if (product) {
      queryClient.invalidateQueries({ queryKey: ['products', product.id] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  }

  const handleOpenBottle = (mlRemaining: number, note?: string) => {
    if (!product) return
    openBottleMutation.mutate(
      { productId: product.id, mlRemaining, note },
      {
        onSuccess: (updatedProduct: any) => {
          setOpenBottleModal(false)
          if (updatedProduct?.stock !== undefined) {
            updateField('stock', String(updatedProduct.stock))
          }
          refreshProduct()
        },
      },
    )
  }

  const isEditMode = !!product
  const hasOpenBottle = openMl > 0
  const canOpenBottle = stock >= 1 && !hasOpenBottle

  // Get unique ml sizes from decant variations (las que se sirven de la
  // botella abierta; sellada/original no descuentan ml)
  const variationMlSizes = [
    ...new Set(
      variations
        .filter((v) => v.presentationType === 'decant')
        .map((v) => Number(v.mlSize) || 0)
        .filter((ml) => ml > 0),
    ),
  ].sort((a, b) => a - b)

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-lg font-semibold text-text">Inventario</h3>

      {/* Full bottle info card */}
      {totalMl > 0 && (
        <div className="mb-4 rounded-lg border border-accent/30 bg-accent/5 p-3">
          <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2">
            Botella completa
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="flex items-center justify-center mb-1">
                <Package size={14} className="text-accent" />
              </div>
              <p className="text-lg font-bold text-text">{stock}</p>
              <p className="text-xs text-text-muted">Selladas</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <Droplets size={14} className="text-accent" />
              </div>
              <p className="text-lg font-bold text-text">{openMl}ml</p>
              <p className="text-xs text-text-muted">Abierta</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <FlaskConical size={14} className="text-accent" />
              </div>
              <p className="text-lg font-bold text-text">{availableMl}ml</p>
              <p className="text-xs text-text-muted">Total</p>
            </div>
          </div>
          {formData.price && (
            <p className="text-xs text-text-muted text-center mt-2">
              Precio botella:{' '}
              <span className="text-accent font-bold">
                ${Number(formData.price).toFixed(2)}
              </span>{' '}
              — {totalMl}ml
            </p>
          )}

          {/* Action button — only in edit mode */}
          {isEditMode && (
            <div className="mt-3">
              {hasOpenBottle ? (
                <p className="text-xs text-blue-400 text-center py-1">
                  Ya hay una botella abierta con {openMl}ml. Se abrira otra
                  cuando se agoten.
                </p>
              ) : (
                <Button
                  size="sm"
                  color="warning"
                  variant="flat"
                  startContent={<Scissors size={14} />}
                  onPress={() => setOpenBottleModal(true)}
                  isDisabled={!canOpenBottle}
                  className="w-full"
                >
                  Abrir botella
                </Button>
              )}
              {stock < 1 && !hasOpenBottle && (
                <p className="text-xs text-red-400 text-center mt-1">
                  Sin botellas selladas
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <Input
          label="Botellas selladas (stock)"
          placeholder="0"
          type="number"
          min={0}
          value={formData.stock}
          onValueChange={(v) => updateField('stock', v)}
          classNames={{
            label: '!text-text',
            input: '!text-text',
            inputWrapper: 'bg-background border-border',
          }}
          isInvalid={stockInvalid}
          errorMessage={
            stockInvalid ? 'Debe ser un entero de 0 o más.' : undefined
          }
        />
        <Input
          label="ML por botella"
          placeholder="100"
          type="number"
          min={1}
          value={formData.totalMl}
          onValueChange={(v) => updateField('totalMl', v)}
          classNames={{
            label: '!text-text',
            input: '!text-text',
            inputWrapper: 'bg-background border-border',
          }}
          isRequired
          isInvalid={totalMlInvalid}
          errorMessage={
            totalMlInvalid ? 'Los ML deben ser mayores a 0.' : undefined
          }
        />
      </div>

      {/* Modal */}
      {isEditMode && (
        <OpenBottleModal
          isOpen={openBottleModal}
          onOpenChange={setOpenBottleModal}
          productName={product.name}
          totalMl={totalMl}
          currentStock={stock}
          variationMlSizes={variationMlSizes}
          isLoading={openBottleMutation.isPending}
          onConfirm={handleOpenBottle}
        />
      )}
    </div>
  )
}
