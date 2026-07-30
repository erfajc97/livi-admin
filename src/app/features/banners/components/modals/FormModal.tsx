import { Button } from '@heroui/react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'
import BannerForm from '../BannerForm'
import type { BannerFormData } from '../../types'

interface FormModalProps {
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
      scrollBehavior="inside"
      isDismissable={!isSubmitting}
      hideCloseButton={isSubmitting}
      headerContent={
        <h3 className="text-lg font-semibold text-text">
          {isThereId ? 'Editar' : 'Crear nuevo'} banner
        </h3>
      }
      footerContent={
        <div className="flex gap-2">
          <Button color="danger" variant="flat" onPress={() => onOpenChange(false)} isDisabled={isSubmitting}>
            Cancelar
          </Button>
          {/* El texto es opcional: lo único imprescindible al crear es la
              imagen (el arte puede traer el título quemado). */}
          <Button
            color="warning"
            onPress={onSubmit}
            isLoading={isSubmitting}
            isDisabled={!isThereId && !imagePreview}
          >
            {isThereId ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      }
    >
      <BannerForm
        formData={formData}
        imagePreview={imagePreview}
        onInputChange={onInputChange}
        onImageChange={onImageChange}
      />
    </CustomModalNextUI>
  )
}
