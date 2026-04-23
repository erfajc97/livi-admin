import { Button } from '@heroui/react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'
import type { BlogPost } from '../../types'

interface DeleteModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  blog: BlogPost | null
  isDeleting: boolean
  onConfirm: () => void
}

export default function DeleteModal({
  isOpen,
  onOpenChange,
  blog,
  isDeleting,
  onConfirm,
}: DeleteModalProps) {
  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      headerContent={
        <h3 className="text-lg font-semibold text-text">Eliminar blog post</h3>
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
        ¿Seguro que deseas eliminar el blog post{' '}
        <span className="font-semibold text-text">{blog?.title}</span>?
      </p>
    </CustomModalNextUI>
  )
}
