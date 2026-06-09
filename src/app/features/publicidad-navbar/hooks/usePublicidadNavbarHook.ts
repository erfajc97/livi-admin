import { useMemo, useState } from 'react'
import { useDisclosure } from '@heroui/react'
import { useBannersQuery } from '@/app/tanstack-queries/bannersQuery'
import { useBannerFormHook } from '@/app/features/banners/hooks/useBannerFormHook'
import { useDeleteBannerMutation } from '@/app/features/banners/mutations/useBannerMutations'
import type { Banner } from '@/app/features/banners/types'

/**
 * Página "Publicidad navbar": gestiona los banners con type='navbar' que
 * alimentan el panel "Destacado" del mega menú del front.
 * Reutiliza el servicio/mutations/upload de banners (S3) filtrando por tipo.
 */
export function usePublicidadNavbarHook() {
  const [id, setId] = useState<string | null>(null)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure()
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null)

  const { data: allBanners = [], isLoading } = useBannersQuery()
  const banners = useMemo(
    () => allBanners.filter((b) => b.type === 'navbar'),
    [allBanners],
  )

  const deleteMutation = useDeleteBannerMutation()

  const { handleToEditForm, resetForm, ...formHook } = useBannerFormHook({
    id,
    defaultType: 'navbar',
    onSuccess: () => onOpenChange(),
  })

  const handleCreateClick = () => {
    setId(null)
    resetForm()
    onOpen()
  }

  const handleEditClick = (banner: Banner) => {
    setId(String(banner.id))
    handleToEditForm(banner)
    onOpen()
  }

  const handleDeleteClick = (banner: Banner) => {
    setDeleteTarget(banner)
    onDeleteOpen()
  }

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(String(deleteTarget.id), {
        onSuccess: () => onDeleteOpenChange(),
      })
    }
  }

  const handleFormModalOpenChange = (open: boolean) => {
    if (!open) {
      setId(null)
      resetForm()
    }
    onOpenChange()
  }

  return {
    banners,
    isLoading,
    formHook,
    deleteTarget,
    isOpen,
    isDeleteOpen,
    isDeleting: deleteMutation.isPending,
    onDeleteOpenChange,
    handleCreateClick,
    handleEditClick,
    handleDeleteClick,
    handleConfirmDelete,
    handleFormModalOpenChange,
  }
}
