import { Button, Spinner } from '@heroui/react'
import { ArrowLeft, Save } from 'lucide-react'
import FormSectionGeneral from './FormSectionGeneral'
import FormSectionMedia from './FormSectionMedia'
import FormSectionCategory from './FormSectionCategory'
import FormSectionPricing from './FormSectionPricing'
import FormSectionInventory from './FormSectionInventory'
import FormSectionFragrance from './FormSectionFragrance'
import FormSectionEditorial from './FormSectionEditorial'
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
    <div className="flex flex-col gap-6 relative">
      {/* Saving overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <Spinner size="lg" color="warning" />
          <p className="text-white font-heading text-lg tracking-wide">
            Guardando producto y subiendo imágenes...
          </p>
          <p className="text-white/60 text-sm">No cierres esta página</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <Button isIconOnly variant="light" onPress={onBack} isDisabled={isSubmitting}>
          <ArrowLeft size={20} className="text-text" />
        </Button>
        <h2 className="text-lg sm:text-xl font-semibold text-text truncate">
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
          <FormSectionEditorial formData={formData} updateField={updateField} />
          <FormSectionVariations
            variations={variations}
            totalMl={Number(formData.totalMl) || 0}
            productName={formData.name}
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
          <FormSectionInventory formData={formData} updateField={updateField} product={fullProduct} variations={variations} />
        </div>
      </div>

      {/* Submit */}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
        <Button variant="flat" onPress={onBack} isDisabled={isSubmitting} className="h-10">
          Cancelar
        </Button>
        <Button
          color="warning"
          startContent={<Save size={16} />}
          onPress={onSubmit}
          isLoading={isSubmitting}
          className="h-10"
        >
          {isEdit ? 'Guardar cambios' : 'Crear producto'}
        </Button>
      </div>
    </div>
  )
}
