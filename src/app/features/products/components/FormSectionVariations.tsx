import { Button, Input } from '@heroui/react'
import { Plus, Trash2 } from 'lucide-react'
import type { VariationRow } from '../types'

interface FormSectionVariationsProps {
  variations: VariationRow[]
  onAdd: () => void
  onUpdate: (index: number, field: keyof VariationRow, value: string) => void
  onRemove: (index: number) => void
}

export default function FormSectionVariations({
  variations,
  onAdd,
  onUpdate,
  onRemove,
}: FormSectionVariationsProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">Variantes del producto</h3>
        <Button size="sm" color="primary" variant="flat" startContent={<Plus size={14} />} onPress={onAdd}>
          Agregar variante
        </Button>
      </div>

      {variations.length === 0 ? (
        <p className="text-sm text-text-muted">No hay variantes configuradas.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {variations.map((v, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 items-end">
              <Input
                label="Nombre"
                placeholder="XL - Rojo"
                size="sm"
                value={v.name}
                onValueChange={(val) => onUpdate(i, 'name', val)}
                classNames={{ label: '!text-text', input: '!text-text', inputWrapper: 'bg-background border-border' }}
              />
              <Input
                label="Precio"
                placeholder="0.00"
                size="sm"
                type="number"
                value={v.price}
                onValueChange={(val) => onUpdate(i, 'price', val)}
                startContent={<span className="text-text-muted text-xs">$</span>}
                classNames={{ label: '!text-text', input: '!text-text', inputWrapper: 'bg-background border-border' }}
              />
              <Input
                label="Stock"
                placeholder="0"
                size="sm"
                type="number"
                value={v.stock}
                onValueChange={(val) => onUpdate(i, 'stock', val)}
                classNames={{ label: '!text-text', input: '!text-text', inputWrapper: 'bg-background border-border' }}
              />
              <Input
                label="SKU"
                placeholder="SKU-001"
                size="sm"
                value={v.sku}
                onValueChange={(val) => onUpdate(i, 'sku', val)}
                classNames={{ label: '!text-text', input: '!text-text', inputWrapper: 'bg-background border-border' }}
              />
              <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => onRemove(i)}>
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
