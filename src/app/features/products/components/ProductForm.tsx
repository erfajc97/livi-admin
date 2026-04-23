import { Button } from '@heroui/react'
import { ArrowLeft, Save } from 'lucide-react'
import FormSectionGeneral from './FormSectionGeneral'
import FormSectionMedia from './FormSectionMedia'
import FormSectionCategory from './FormSectionCategory'
import FormSectionPricing from './FormSectionPricing'
import FormSectionInventory from './FormSectionInventory'
import FormSectionFragrance from './FormSectionFragrance'
import FormSectionDetail from './FormSectionDetail'
import FormSectionVariations from './FormSectionVariations'
import type { Product, ProductFormData, ProductImage, VariationRow } from '../types'

interface ProductFormProps {
  formData: ProductFormData
  variations: VariationRow[]
  imagePreviews: string[]
  existingImages: ProductImage[]
  updateField: <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => void
  addImageFiles: (files: File[]) => void
  removeNewImage: (index: number) => void
  removeExistingImage: (imageId: number) => void
  addVariation: () => void
  updateVariation: (index: number, field: keyof VariationRow, value: string | boolean) => void
  removeVariation: (index: number) => void
  addVariationImages: (varIndex: number, files: File[]) => void
  removeVariationNewImage: (varIndex: number, imgIndex: number) => void
  removeVariationExistingImage: (varIndex: number, imageId: number) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
  isEdit: boolean
  fullProduct?: Product | null
}

export default function ProductForm({
  formData,
  variations,
  imagePreviews,
  existingImages,
  updateField,
  addImageFiles,
  removeNewImage,
  removeExistingImage,
  addVariation,
  updateVariation,
  removeVariation,
  addVariationImages,
  removeVariationNewImage,
  removeVariationExistingImage,
  onSubmit,
  onBack,
  isSubmitting,
  isEdit,
  fullProduct,
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
          <FormSectionMedia
            imagePreviews={imagePreviews}
            existingImages={existingImages}
            onAddFiles={addImageFiles}
            onRemoveNew={removeNewImage}
            onRemoveExisting={removeExistingImage}
          />
          <FormSectionDetail formData={formData} updateField={updateField} />
          <FormSectionVariations
            variations={variations}
            onAdd={addVariation}
            onUpdate={updateVariation}
            onRemove={removeVariation}
            onAddImages={addVariationImages}
            onRemoveNewImage={removeVariationNewImage}
            onRemoveExistingImage={removeVariationExistingImage}
          />
        </div>

        {/* Right column — sidebar */}
        <div className="flex flex-col gap-6">
          <FormSectionCategory formData={formData} updateField={updateField} />
          <FormSectionPricing formData={formData} updateField={updateField} />
          <FormSectionFragrance formData={formData} updateField={updateField} />
          <FormSectionInventory formData={formData} updateField={updateField} product={fullProduct} />
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button variant="flat" onPress={onBack}>
          Cancelar
        </Button>
        <Button
          color="warning"
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
