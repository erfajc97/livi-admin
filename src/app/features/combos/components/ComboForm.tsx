import type { ReactNode } from 'react'
import { Button, Input, Switch, Textarea } from '@heroui/react'
import { ArrowLeft, Plus, Upload } from 'lucide-react'
import ComboProductRowVariations from './ComboProductRowVariations'
import type { ComboFormData, ComboProductRow } from '../types'

interface ComboFormProps {
  formData: ComboFormData
  productRows: ComboProductRow[]
  updateField: <K extends keyof ComboFormData>(
    key: K,
    value: ComboFormData[K],
  ) => void
  addProductRow: () => void
  updateProductRow: (
    index: number,
    field: keyof ComboProductRow,
    value: string,
  ) => void
  removeProductRow: (index: number) => void
  onImageChange: (file: File | null) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
  isEdit: boolean
  children?: ReactNode
}

export default function ComboForm({
  formData,
  productRows,
  updateField,
  addProductRow,
  updateProductRow,
  removeProductRow,
  onImageChange,
  onSubmit,
  onBack,
  isSubmitting,
  isEdit,
  children,
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
          <h3 className="text-sm font-medium text-text-muted uppercase">
            Información general
          </h3>

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

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-text">Imagen del combo</label>
            {(formData.imageUrl || formData.imageFile) && (
              <img
                src={
                  formData.imageFile
                    ? URL.createObjectURL(formData.imageFile)
                    : formData.imageUrl
                }
                alt="Preview"
                className="h-32 w-32 rounded-lg object-cover"
              />
            )}
            <div className="flex items-center gap-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-bg-alt px-4 py-2 text-sm text-text hover:bg-surface">
                <Upload size={16} />
                <span>
                  {formData.imageFile || formData.imageUrl
                    ? 'Cambiar imagen'
                    : 'Subir imagen'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onImageChange(e.target.files?.[0] ?? null)}
                />
              </label>
              {(formData.imageFile || formData.imageUrl) && (
                <Button
                  size="sm"
                  variant="flat"
                  color="danger"
                  onPress={() => {
                    updateField('imageFile', null)
                    updateField('imageUrl', '')
                  }}
                >
                  Eliminar
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Precio final ($)"
              type="number"
              value={formData.finalPrice}
              onValueChange={(v) => updateField('finalPrice', v)}
              classNames={{ label: '!text-text', input: '!text-text' }}
            />
            <Input
              label="Descuento ($)"
              type="number"
              placeholder="Opcional"
              value={formData.discount}
              onValueChange={(v) => updateField('discount', v)}
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
            <h3 className="text-sm font-medium text-text-muted uppercase">
              Productos del combo
            </h3>
            <Button
              size="sm"
              variant="flat"
              startContent={<Plus size={16} />}
              onPress={addProductRow}
            >
              Agregar
            </Button>
          </div>

          {productRows.map((row, index) => (
            <ComboProductRowVariations
              key={index}
              row={row}
              index={index}
              updateProductRow={updateProductRow}
              removeProductRow={removeProductRow}
              canRemove={productRows.length > 1}
            />
          ))}
        </div>
      </div>

      {children}

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
