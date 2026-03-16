import { Button } from '@heroui/react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'
import type { Combo } from '../../types'

interface DeleteComboModalProps {
  isOpen: boolean
  onClose: () => void
  combo: Combo | null
  onConfirm: () => void
  isDeleting: boolean
}

export default function DeleteComboModal({
  isOpen,
  onClose,
  combo,
  onConfirm,
  isDeleting,
}: DeleteComboModalProps) {
  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      headerContent={<h3>Eliminar combo</h3>}
    >
      <div className="flex flex-col gap-4">
        <p className="text-text-muted">
          ¿Estás seguro de eliminar <strong className="text-text">{combo?.name}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="flat" onPress={onClose}>
            Cancelar
          </Button>
          <Button color="danger" onPress={onConfirm} isLoading={isDeleting}>
            Eliminar
          </Button>
        </div>
      </div>
    </CustomModalNextUI>
  )
}
