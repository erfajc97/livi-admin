import { Button, Input, Switch, Textarea } from '@heroui/react'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import ComboProductSelector from './ComboProductSelector'
import type { ComboFormData, ComboProductRow } from '../types'

interface ComboFormProps {
  formData: ComboFormData
  productRows: ComboProductRow[]
  updateField: <K extends keyof ComboFormData>(key: K, value: ComboFormData[K]) => void
  addProductRow: () => void
  updateProductRow: (index: number, field: keyof ComboProductRow, value: string) => void
  removeProductRow: (index: number) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
  isEdit: boolean
}

export default function ComboForm({
  formData,
  productRows,
  updateField,
  addProductRow,
  updateProductRow,
  removeProductRow,
  onSubmit,
  onBack,
  isSubmitting,
  isEdit,
}: ComboFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button isIconOnly variant="flat" onPress={onBack}>
          <ArrowLeft size={18} />
        </Button>
        <h2 className="text-xl font-semibold text-text">
          {isEdit ? 'Editar combo' : 'Crear nuevo combo'}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
          <h3 className="text-sm font-medium text-text-muted uppercase">Información general</h3>

          <Input
            label="Nombre del combo"
            value={formData.name}
            onValueChange={(v) => updateField('name', v)}
            classNames={{ label: '!text-text', input: '!text-text' }}
          />

          <Textarea
            label="Descripción"
            value={formData.description}
            onValueChange={(v) => updateField('description', v)}
            classNames={{ label: '!text-text', input: '!text-text' }}
          />

          <Input
            label="URL de imagen"
            value={formData.imageUrl}
            onValueChange={(v) => updateField('imageUrl', v)}
            classNames={{ label: '!text-text', input: '!text-text' }}
          />

          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="h-32 w-32 rounded-lg object-cover"
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Precio final ($)"
              type="number"
              value={formData.finalPrice}
              onValueChange={(v) => updateField('finalPrice', v)}
              classNames={{ label: '!text-text', input: '!text-text' }}
            />
            <Input
              label="Etiqueta de tamaño"
              placeholder="ej: 5ml C/U"
              value={formData.sizeLabel}
              onValueChange={(v) => updateField('sizeLabel', v)}
              classNames={{ label: '!text-text', input: '!text-text' }}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              isSelected={formData.isActive}
              onValueChange={(v) => updateField('isActive', v)}
              size="sm"
            />
            <span className="text-sm text-text">Combo activo</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-text-muted uppercase">Productos del combo</h3>
            <Button size="sm" variant="flat" startContent={<Plus size={16} />} onPress={addProductRow}>
              Agregar
            </Button>
          </div>

          {productRows.map((row, index) => (
            <div key={index} className="flex items-end gap-3">
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
              {productRows.length > 1 && (
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
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="flat" onPress={onBack}>
          Cancelar
        </Button>
        <Button color="warning" onPress={onSubmit} isLoading={isSubmitting}>
          {isEdit ? 'Guardar cambios' : 'Crear combo'}
        </Button>
      </div>
    </div>
  )
}
