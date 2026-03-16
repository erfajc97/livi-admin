import { Button } from '@heroui/react'
import { PencilIcon, PlusIcon } from 'lucide-react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'
import UserForm from '../UserForm'
import type { UserRole } from '../../types'

interface FormModalProps {
  isThereId: string | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  formData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: UserRole
  }
  isLoading: boolean
  onInputChange: (field: string, value: string | boolean) => void
  onSubmit: () => void
}

export default function FormModal({
  isThereId,
  isOpen,
  onOpenChange,
  formData,
  isLoading,
  onInputChange,
  onSubmit,
}: FormModalProps) {
  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={!isLoading}
      size="xl"
      placement="center"
      headerContent={
        <h3>{isThereId ? 'Editar usuario' : 'Crear nuevo usuario'}</h3>
      }
    >
      <UserForm
        isThereId={isThereId}
        formData={formData}
        onInputChange={onInputChange}
      />

      <div className="flex gap-2 ml-auto pt-2">
        <Button
          color="danger"
          variant="flat"
          onPress={() => onOpenChange(false)}
          isDisabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          color="primary"
          radius="full"
          isLoading={isLoading}
          onPress={onSubmit}
          endContent={isThereId ? <PencilIcon size={14} /> : <PlusIcon size={14} />}
        >
          {isThereId ? 'Editar' : 'Crear'} usuario
        </Button>
      </div>
    </CustomModalNextUI>
  )
}
