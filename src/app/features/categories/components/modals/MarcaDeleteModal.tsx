import { Button } from '@heroui/react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'
import type { Marca } from '../../types'

interface MarcaDeleteModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  marca: Marca | null
  isDeleting: boolean
  onConfirm: () => void
}

export default function MarcaDeleteModal({
  isOpen,
  onOpenChange,
  marca,
  isDeleting,
  onConfirm,
}: MarcaDeleteModalProps) {
  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      headerContent={
        <h3 className="text-lg font-semibold text-text">Eliminar marca</h3>
      }
      footerContent={
        <div className="flex gap-2">
          <Button color="danger" variant="flat" onPress={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button color="danger" onPress={onConfirm} isLoading={isDeleting}>
            Eliminar
          </Button>
        </div>
      }
    >
      <p className="text-text-muted">
        ¿Seguro que deseas eliminar la marca{' '}
        <span className="font-semibold text-text">{marca?.name}</span>?
      </p>
    </CustomModalNextUI>
  )
}
