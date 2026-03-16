import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'
import { bannersService } from '../services/bannersService'
import type { CreateBannerPayload, UpdateBannerPayload } from '../types'

export const useCreateBannerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBannerPayload) => bannersService.createBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      addToast({ title: 'Banner creado exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      addToast({ title: error.message ?? 'Error al crear el banner', color: 'danger' })
    },
  })
}

export const useUpdateBannerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBannerPayload }) =>
      bannersService.updateBanner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      addToast({ title: 'Banner actualizado exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      addToast({ title: error.message ?? 'Error al actualizar el banner', color: 'danger' })
    },
  })
}

export const useDeleteBannerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => bannersService.deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      addToast({ title: 'Banner eliminado exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      addToast({ title: error.message ?? 'Error al eliminar el banner', color: 'danger' })
    },
  })
}
