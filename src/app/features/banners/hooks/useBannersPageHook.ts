import { useState } from 'react'
import { useDisclosure } from '@heroui/react'
import { useBannersQuery } from '@/app/tanstack-queries/bannersQuery'
import { useBannerFormHook } from './useBannerFormHook'
import { useDeleteBannerMutation } from '../mutations/useBannerMutations'
import type { Banner } from '../types'

export function useBannersPageHook() {
  const [id, setId] = useState<string | null>(null)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure()
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null)

  const { data: banners = [], isLoading } = useBannersQuery()
  const deleteMutation = useDeleteBannerMutation()

  const { handleToEditForm, resetForm, ...formHook } = useBannerFormHook({
    id,
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
    id,
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
