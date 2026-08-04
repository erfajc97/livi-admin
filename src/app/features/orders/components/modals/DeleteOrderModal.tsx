import { Button } from '@heroui/react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'

interface DeleteOrderModalProps {
  isOpen: boolean
  orderNumber: string
  isLoading: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function DeleteOrderModal({
  isOpen,
  orderNumber,
  isLoading,
  onConfirm,
  onClose,
}: DeleteOrderModalProps) {
  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      headerContent={<span className="text-text">Eliminar orden</span>}
    >
      <div className="flex flex-col gap-4 p-4">
        <p className="text-text-muted">
          ¿Estás seguro de que deseas eliminar la orden{' '}
          <span className="font-semibold text-accent">{orderNumber}</span>? Esta
          acción no se puede deshacer.
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="flat" onPress={onClose} isDisabled={isLoading}>
            Cancelar
          </Button>
          <Button color="danger" onPress={onConfirm} isLoading={isLoading}>
            Eliminar
          </Button>
        </div>
      </div>
    </CustomModalNextUI>
  )
}
