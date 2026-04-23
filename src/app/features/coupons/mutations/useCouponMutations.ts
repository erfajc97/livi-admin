import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'
import { couponsService } from '../services/couponsService'
import type { CreateCouponPayload, UpdateCouponPayload } from '../types'

export const useCreateCouponMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCouponPayload) => couponsService.createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      addToast({ title: 'Cupón creado exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      addToast({ title: error.message ?? 'Error al crear el cupón', color: 'danger' })
    },
  })
}

export const useUpdateCouponMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCouponPayload }) =>
      couponsService.updateCoupon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      addToast({ title: 'Cupón actualizado exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      addToast({ title: error.message ?? 'Error al actualizar el cupón', color: 'danger' })
    },
  })
}

export const useDeleteCouponMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => couponsService.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      addToast({ title: 'Cupón eliminado exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      addToast({ title: error.message ?? 'Error al eliminar el cupón', color: 'danger' })
    },
  })
}
