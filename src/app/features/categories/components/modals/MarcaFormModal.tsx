import { Button } from '@heroui/react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'
import MarcaForm from '../MarcaForm'
import type { MarcaFormData } from '../../types'

interface MarcaFormModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isEditing: boolean
  isSubmitting: boolean
  formData: MarcaFormData
  onInputChange: (field: keyof MarcaFormData, value: string | boolean) => void
  onImageChange: (file: File | null) => void
  onSubmit: () => void
}

export default function MarcaFormModal({
  isOpen,
  onOpenChange,
  isEditing,
  isSubmitting,
  formData,
  onInputChange,
  onImageChange,
  onSubmit,
}: MarcaFormModalProps) {
  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      isDismissable={!isSubmitting}
      hideCloseButton={isSubmitting}
      headerContent={
        <h3 className="text-lg font-semibold text-text">
          {isEditing ? 'Editar' : 'Crear nueva'} marca
        </h3>
      }
      footerContent={
        <div className="flex gap-2">
          <Button color="danger" variant="flat" onPress={() => onOpenChange(false)} isDisabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            color="warning"
            onPress={onSubmit}
            isLoading={isSubmitting}
            isDisabled={!formData.name.trim()}
          >
            {isEditing ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      }
    >
      <MarcaForm formData={formData} onInputChange={onInputChange} onImageChange={onImageChange} />
    </CustomModalNextUI>
  )
}
