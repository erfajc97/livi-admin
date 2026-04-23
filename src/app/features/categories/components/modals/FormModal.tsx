import { Button } from '@heroui/react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'
import CategoryForm from '../CategoryForm'
import type { CategoryFormData } from '../../types'

interface FormModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isThereId: boolean
  isSubmitting: boolean
  formData: CategoryFormData
  imagePreview: string | null
  onInputChange: (field: keyof CategoryFormData, value: string | boolean) => void
  onImageChange: (file: File | null) => void
  onSubmit: () => void
}

export default function FormModal({
  isOpen,
  onOpenChange,
  isThereId,
  isSubmitting,
  formData,
  imagePreview,
  onInputChange,
  onImageChange,
  onSubmit,
}: FormModalProps) {
  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      headerContent={
        <h3 className="text-lg font-semibold text-text">
          {isThereId ? 'Editar' : 'Crear nueva'} categoría
        </h3>
      }
      footerContent={
        <div className="flex gap-2">
          <Button color="danger" variant="flat" onPress={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            color="warning"
            onPress={onSubmit}
            isLoading={isSubmitting}
            isDisabled={!formData.name.trim()}
          >
            {isThereId ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      }
    >
      <CategoryForm
        formData={formData}
        imagePreview={imagePreview}
        onInputChange={onInputChange}
        onImageChange={onImageChange}
      />
    </CustomModalNextUI>
  )
}
