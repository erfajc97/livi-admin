import { Button } from '@heroui/react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'
import type { BannerFormData } from '@/app/features/banners/types'
import PublicidadNavbarForm from './PublicidadNavbarForm'

interface PublicidadFormModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isThereId: boolean
  isSubmitting: boolean
  formData: BannerFormData
  imagePreview: string | null
  onInputChange: (field: keyof BannerFormData, value: string | boolean) => void
  onImageChange: (file: File | null) => void
  onSubmit: () => void
}

export default function PublicidadFormModal({
  isOpen,
  onOpenChange,
  isThereId,
  isSubmitting,
  formData,
  imagePreview,
  onInputChange,
  onImageChange,
  onSubmit,
}: PublicidadFormModalProps) {
  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      scrollBehavior="inside"
      isDismissable={!isSubmitting}
      hideCloseButton={isSubmitting}
      headerContent={
        <h3 className="text-lg font-semibold text-text">
          {isThereId ? 'Editar' : 'Crear'} publicidad del navbar
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
            isDisabled={!formData.title.trim()}
          >
            {isThereId ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      }
    >
      <PublicidadNavbarForm
        formData={formData}
        imagePreview={imagePreview}
        onInputChange={onInputChange}
        onImageChange={onImageChange}
      />
    </CustomModalNextUI>
  )
}
