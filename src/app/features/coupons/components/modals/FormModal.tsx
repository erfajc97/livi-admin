import { Button } from '@heroui/react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'
import CouponForm from '../CouponForm'
import type { CouponFormData } from '../../types'

interface FormModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  isThereId: boolean
  isSubmitting: boolean
  formData: CouponFormData
  onInputChange: (field: keyof CouponFormData, value: string | boolean) => void
  onSubmit: () => void
}

export default function FormModal({
  isOpen,
  onOpenChange,
  isThereId,
  isSubmitting,
  formData,
  onInputChange,
  onSubmit,
}: FormModalProps) {
  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      scrollBehavior="inside"
      headerContent={
        <h3 className="text-lg font-semibold text-text">
          {isThereId ? 'Editar' : 'Crear nuevo'} cupón
        </h3>
      }
      footerContent={
        <div className="flex gap-2">
          <Button color="danger" variant="flat" onPress={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            color="warning"
            onPress={onSubmit}
            isLoading={isSubmitting}
            isDisabled={!formData.code.trim() || (formData.type !== 'free_shipping' && !formData.value) || !formData.expiresAt}
          >
            {isThereId ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      }
    >
      <CouponForm formData={formData} onInputChange={onInputChange} />
    </CustomModalNextUI>
  )
}
