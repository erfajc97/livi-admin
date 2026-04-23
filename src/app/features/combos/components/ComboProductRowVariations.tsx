import { Button, Input } from '@heroui/react'
import { Trash2 } from 'lucide-react'
import ComboProductSelector from './ComboProductSelector'
import ComboVariationSelector from './ComboVariationSelector'
import { useProductByIdQuery } from '@/app/tanstack-queries/productsQuery'
import type { ComboProductRow } from '../types'

interface ComboProductRowVariationsProps {
  row: ComboProductRow
  index: number
  updateProductRow: (index: number, field: keyof ComboProductRow, value: string) => void
  removeProductRow: (index: number) => void
  canRemove: boolean
}

export default function ComboProductRowVariations({
  row,
  index,
  updateProductRow,
  removeProductRow,
  canRemove,
}: ComboProductRowVariationsProps) {
  const productId = row.productId ? parseInt(row.productId, 10) : 0
  const { data: product, isLoading: isLoadingProduct } = useProductByIdQuery(
    productId,
    productId > 0
  )

  const variations = product?.variations ?? []

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border/50 p-3">
      <div className="flex items-end gap-3">
        <ComboProductSelector
          value={row.productId}
          onChange={(v) => updateProductRow(index, 'productId', v)}
        />
        <Input
          label="Cant."
          type="number"
          value={row.quantity}
          onValueChange={(v) => updateProductRow(index, 'quantity', v)}
          classNames={{ label: '!text-text', input: '!text-text' }}
          className="max-w-20"
        />
        {canRemove && (
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            color="danger"
            onPress={() => removeProductRow(index)}
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>

      {row.productId && (
        <ComboVariationSelector
          variations={variations}
          value={row.productVariationId}
          onChange={(v) => updateProductRow(index, 'productVariationId', v)}
          isLoading={isLoadingProduct}
        />
      )}
    </div>
  )
}
