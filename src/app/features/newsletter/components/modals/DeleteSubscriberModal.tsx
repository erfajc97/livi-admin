import { Button } from '@heroui/react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'
import type { Subscriber } from '../../types'

interface DeleteSubscriberModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  subscriber: Subscriber | null
  isDeleting: boolean
  onConfirm: () => void
}

export function DeleteSubscriberModal({
  isOpen,
  onOpenChange,
  subscriber,
  isDeleting,
  onConfirm,
}: DeleteSubscriberModalProps) {
  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      headerContent="Eliminar suscriptor"
      footerContent={
        <div className="flex gap-2">
          <Button variant="flat" onPress={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            color="danger"
            onPress={onConfirm}
            isLoading={isDeleting}
          >
            Eliminar
          </Button>
        </div>
      }
    >
      <p className="text-text-muted">
        ¿Estás seguro de eliminar al suscriptor{' '}
        <strong className="text-text">{subscriber?.email}</strong>? Esta acción
        no se puede deshacer.
      </p>
    </CustomModalNextUI>
  )
}
