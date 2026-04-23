import { useState } from 'react'
import { useDisclosure } from '@heroui/react'
import { useCategoriesQuery } from '@/app/tanstack-queries/categoriesQuery'
import { useCategoryFormHook } from './useCategoryFormHook'
import { useDeleteCategoryMutation } from '../mutations/useCategoryMutations'
import type { Category } from '../types'

export function useCategoriesPageHook() {
  const [id, setId] = useState<number | null>(null)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure()
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const { data: categories = [], isLoading } = useCategoriesQuery()
  const deleteMutation = useDeleteCategoryMutation()

  const { handleToEditForm, resetForm, ...formHook } = useCategoryFormHook({
    id,
    onSuccess: () => onOpenChange(),
  })

  const handleCreateClick = () => {
    setId(null)
    resetForm()
    onOpen()
  }

  const handleEditClick = (category: Category) => {
    setId(category.id)
    handleToEditForm(category)
    onOpen()
  }

  const handleDeleteClick = (category: Category) => {
    setDeleteTarget(category)
    onDeleteOpen()
  }

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id, {
        onSuccess: () => {
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

  return {
    id,
    categories,
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
