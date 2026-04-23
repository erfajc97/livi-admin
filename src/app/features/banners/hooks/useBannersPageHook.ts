import { useState } from 'react'
import { useDisclosure } from '@heroui/react'
import { arrayMove } from '@dnd-kit/sortable'
import type { DragEndEvent } from '@dnd-kit/core'
import { useBannersQuery } from '@/app/tanstack-queries/bannersQuery'
import { useBannerFormHook } from './useBannerFormHook'
import { useDeleteBannerMutation, useReorderBannersMutation } from '../mutations/useBannerMutations'
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
  const [localBanners, setLocalBanners] = useState<Banner[] | null>(null)

  const { data: banners = [], isLoading } = useBannersQuery()
  const deleteMutation = useDeleteBannerMutation()
  const reorderMutation = useReorderBannersMutation()

  const displayBanners = localBanners ?? banners

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
        onSuccess: () => {
          setLocalBanners(null)
          onDeleteOpenChange()
        },
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const currentList = displayBanners
    const oldIndex = currentList.findIndex((b) => b.id === active.id)
    const newIndex = currentList.findIndex((b) => b.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(currentList, oldIndex, newIndex)
    setLocalBanners(reordered)
    reorderMutation.mutate(
      reordered.map((b) => Number(b.id)),
      { onSettled: () => setLocalBanners(null) },
    )
  }

  return {
    id,
    banners: displayBanners,
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
    handleDragEnd,
  }
}
