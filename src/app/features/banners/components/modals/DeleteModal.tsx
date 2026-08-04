import { Button } from '@heroui/react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'
import type { Banner } from '../../types'

interface DeleteModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  banner: Banner | null
  isDeleting: boolean
  onConfirm: () => void
}

export default function DeleteModal({
  isOpen,
  onOpenChange,
  banner,
  isDeleting,
  onConfirm,
}: DeleteModalProps) {
  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      headerContent={
        <h3 className="text-lg font-semibold text-text">Eliminar banner</h3>
      }
      footerContent={
        <div className="flex gap-2">
          <Button
            color="danger"
            variant="flat"
            onPress={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button color="danger" onPress={onConfirm} isLoading={isDeleting}>
            Eliminar
          </Button>
        </div>
      }
    >
      <p className="text-text-muted">
        ¿Seguro que deseas eliminar el banner{' '}
        <span className="font-semibold text-text">{banner?.title}</span>?
      </p>
    </CustomModalNextUI>
  )
}
