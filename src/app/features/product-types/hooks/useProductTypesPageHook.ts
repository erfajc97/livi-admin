import { useState } from 'react'
import { useDisclosure } from '@heroui/react'
import { useProductTypesQuery } from '@/app/tanstack-queries/productTypesQuery'
import { useProductTypeFormHook } from './useProductTypeFormHook'
import { useDeleteProductTypeMutation } from '../mutations/useProductTypeMutations'
import type { ProductType } from '../types'

export function useProductTypesPageHook() {
  const [id, setId] = useState<number | null>(null)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure()
  const [deleteTarget, setDeleteTarget] = useState<ProductType | null>(null)

  const { data: productTypes = [], isLoading } = useProductTypesQuery()
  const deleteMutation = useDeleteProductTypeMutation()

  const { handleToEditForm, resetForm, ...formHook } = useProductTypeFormHook({
    id,
    onSuccess: () => onOpenChange(),
  })

  const handleCreateClick = () => {
    setId(null)
    resetForm()
    onOpen()
  }

  const handleEditClick = (item: ProductType) => {
    setId(item.id)
    handleToEditForm(item)
    onOpen()
  }

  const handleDeleteClick = (item: ProductType) => {
    setDeleteTarget(item)
    onDeleteOpen()
  }

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id, {
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
    productTypes,
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
