import { Button } from '@heroui/react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'
import { useDeleteUserMutation } from '../../mutations/useUserMutations'
import type { User } from '../../types'

interface DeleteModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
}

export default function DeleteModal({
  isOpen,
  onOpenChange,
  user,
}: DeleteModalProps) {
  const { mutate: deleteUser, isPending } = useDeleteUserMutation()

  const handleDelete = () => {
    if (!user) return
    deleteUser(user.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={!isPending}
      size="md"
      headerContent={<h3>Eliminar usuario</h3>}
      footerContent={
        <>
          <Button
            color="default"
            variant="flat"
            onPress={() => onOpenChange(false)}
            isDisabled={isPending}
          >
            <p className="text-text">Cancelar</p>
          </Button>
          <Button color="danger" isLoading={isPending} onPress={handleDelete}>
            Eliminar
          </Button>
        </>
      }
    >
      <p>
        ¿Estás seguro de que deseas eliminar a <strong>{user?.email}</strong>?
      </p>
      <p className="text-sm text-danger">Esta acción no se puede deshacer.</p>
    </CustomModalNextUI>
  )
}
