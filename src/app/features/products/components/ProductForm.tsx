import { Button, Spinner } from '@heroui/react'
import { AlertCircle, ArrowLeft, Save } from 'lucide-react'
import FormSectionGeneral from './FormSectionGeneral'
import FormSectionDetail from './FormSectionDetail'
import FormSectionMedia from './FormSectionMedia'
import FormSectionCategory from './FormSectionCategory'
import FormSectionPricing from './FormSectionPricing'
import FormSectionInventory from './FormSectionInventory'
import FormSectionVariations from './FormSectionVariations'
import FormSectionPairsWith from './FormSectionPairsWith'
import FormSectionInstagram from './FormSectionInstagram'
import type {
  Product,
  ProductFormData,
  ProductImage,
  VariationRow,
} from '../types'

interface ProductFormProps {
  formData: ProductFormData
  variations: VariationRow[]
  imagePreviews: string[]
  existingImages: ProductImage[]
  updateField: <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K],
  ) => void
  addImageFiles: (files: File[]) => void
  removeNewImage: (index: number) => void
  removeExistingImage: (imageId: number | string) => void
  moveExistingImage: (imageId: number | string, direction: -1 | 1) => void
  addVariation: () => void
  updateVariation: (
    index: number,
    field: keyof VariationRow,
    value: string | boolean,
  ) => void
  removeVariation: (index: number) => void
  addVariationImages: (varIndex: number, files: File[]) => void
  removeVariationNewImage: (varIndex: number, imgIndex: number) => void
  removeVariationExistingImage: (varIndex: number, imageId: number) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
  isEdit: boolean
  fullProduct?: Product | null
  /** Campos pendientes; con al menos uno el guardado queda bloqueado. */
  errors: string[]
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
  moveExistingImage,
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
  errors,
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
        <Button
          isIconOnly
          variant="light"
          onPress={onBack}
          isDisabled={isSubmitting}
        >
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
          <FormSectionDetail formData={formData} updateField={updateField} />
          <FormSectionMedia
            imagePreviews={imagePreviews}
            existingImages={existingImages}
            onAddFiles={addImageFiles}
            onRemoveNew={removeNewImage}
            onRemoveExisting={removeExistingImage}
            onMoveExisting={moveExistingImage}
          />
          <FormSectionVariations
            variations={variations}
            productName={formData.name}
            formData={formData}
            updateField={updateField}
            onAdd={addVariation}
            onUpdate={updateVariation}
            onRemove={removeVariation}
            onAddImages={addVariationImages}
            onRemoveNewImage={removeVariationNewImage}
            onRemoveExistingImage={removeVariationExistingImage}
          />
          <FormSectionPairsWith
            formData={formData}
            updateField={updateField}
            currentProductId={fullProduct?.id ?? null}
          />
          <FormSectionInstagram formData={formData} updateField={updateField} />
        </div>

        {/* Right column — sidebar */}
        <div className="flex flex-col gap-6">
          <FormSectionCategory formData={formData} updateField={updateField} />
          <FormSectionPricing formData={formData} updateField={updateField} />
          <FormSectionInventory
            formData={formData}
            updateField={updateField}
            product={fullProduct}
            variations={variations}
          />
        </div>
      </div>

      {/* Submit — bloqueado mientras falten datos obligatorios */}
      <div className="flex flex-col gap-3">
        {errors.length > 0 && (
          <div className="rounded-xl border border-danger/40 bg-danger/5 p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-danger">
              <AlertCircle size={16} />
              Completa estos campos para{' '}
              {isEdit ? 'guardar' : 'crear el producto'}
            </p>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-xs text-text-muted">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            variant="flat"
            onPress={onBack}
            isDisabled={isSubmitting}
            className="h-10"
          >
            Cancelar
          </Button>
          <Button
            color="warning"
            startContent={<Save size={16} />}
            onPress={onSubmit}
            isLoading={isSubmitting}
            isDisabled={errors.length > 0}
            className="h-10"
          >
            {isEdit ? 'Guardar cambios' : 'Crear producto'}
          </Button>
        </div>
      </div>
    </div>
  )
}
