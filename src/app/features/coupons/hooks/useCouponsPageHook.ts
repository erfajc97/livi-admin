import { useState } from 'react'
import { useDisclosure } from '@heroui/react'
import { useCouponsQuery } from '@/app/tanstack-queries/couponsQuery'
import { useCouponFormHook } from './useCouponFormHook'
import { useDeleteCouponMutation } from '../mutations/useCouponMutations'
import type { Coupon } from '../types'

export function useCouponsPageHook() {
  const [id, setId] = useState<string | null>(null)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure()
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null)

  const { data: coupons = [], isLoading } = useCouponsQuery()
  const deleteMutation = useDeleteCouponMutation()

  const { handleToEditForm, resetForm, ...formHook } = useCouponFormHook({
    id,
    onSuccess: () => onOpenChange(),
  })

  const handleCreateClick = () => {
    setId(null)
    resetForm()
    onOpen()
  }

  const handleEditClick = (coupon: Coupon) => {
    setId(String(coupon.id))
    handleToEditForm(coupon)
    onOpen()
  }

  const handleDeleteClick = (coupon: Coupon) => {
    setDeleteTarget(coupon)
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
    coupons,
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
