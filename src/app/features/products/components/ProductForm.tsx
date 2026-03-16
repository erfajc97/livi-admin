import { Button } from '@heroui/react'
import { ArrowLeft, Save } from 'lucide-react'
import FormSectionGeneral from './FormSectionGeneral'
import FormSectionMedia from './FormSectionMedia'
import FormSectionCategory from './FormSectionCategory'
import FormSectionPricing from './FormSectionPricing'
import FormSectionInventory from './FormSectionInventory'
import FormSectionVariations from './FormSectionVariations'
import type { ProductFormData, VariationRow } from '../types'

interface ProductFormProps {
  formData: ProductFormData
  variations: VariationRow[]
  updateField: <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => void
  addVariation: () => void
  updateVariation: (index: number, field: keyof VariationRow, value: string) => void
  removeVariation: (index: number) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
  isEdit: boolean
}

export default function ProductForm({
  formData,
  variations,
  updateField,
  addVariation,
  updateVariation,
  removeVariation,
  onSubmit,
  onBack,
  isSubmitting,
  isEdit,
}: ProductFormProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button isIconOnly variant="light" onPress={onBack}>
          <ArrowLeft size={20} className="text-text" />
        </Button>
        <h2 className="text-xl font-semibold text-text">
          {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left column — main form */}
        <div className="flex flex-col gap-6">
          <FormSectionGeneral formData={formData} updateField={updateField} />
          <FormSectionMedia formData={formData} updateField={updateField} />
          <FormSectionVariations
            variations={variations}
            onAdd={addVariation}
            onUpdate={updateVariation}
            onRemove={removeVariation}
          />
        </div>

        {/* Right column — sidebar */}
        <div className="flex flex-col gap-6">
          <FormSectionCategory formData={formData} updateField={updateField} />
          <FormSectionPricing formData={formData} updateField={updateField} />
          <FormSectionInventory formData={formData} updateField={updateField} />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button variant="flat" onPress={onBack}>
          Cancelar
        </Button>
        <Button
          color="primary"
          startContent={<Save size={16} />}
          onPress={onSubmit}
          isLoading={isSubmitting}
        >
          {isEdit ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </div>
    </div>
  )
}
