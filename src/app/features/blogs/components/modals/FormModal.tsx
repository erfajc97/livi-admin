import { Button } from '@heroui/react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'
import BlogForm from '../BlogForm'
import type { BlogFormData } from '../../hooks/useBlogFormHook'

interface FormModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isThereId: boolean
  isSubmitting: boolean
  formData: BlogFormData
  imagePreview: string | null
  onInputChange: (field: keyof BlogFormData, value: string | boolean) => void
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
      size="3xl"
      scrollBehavior="inside"
      isDismissable={!isSubmitting}
      hideCloseButton={isSubmitting}
      headerContent={
        <h3 className="text-lg font-semibold text-text">
          {isThereId ? 'Editar' : 'Crear nuevo'} blog post
        </h3>
      }
      footerContent={
        <div className="flex gap-2">
          <Button
            color="danger"
            variant="flat"
            onPress={() => onOpenChange(false)}
            isDisabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            color="warning"
            onPress={onSubmit}
            isLoading={isSubmitting}
            isDisabled={!formData.title.trim() || !formData.content.trim()}
          >
            {isThereId ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      }
    >
      <BlogForm
        formData={formData}
        imagePreview={imagePreview}
        onInputChange={onInputChange}
        onImageChange={onImageChange}
      />
    </CustomModalNextUI>
  )
}
