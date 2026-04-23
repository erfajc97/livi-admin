import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'
import { bannersService } from '../services/bannersService'
import type { CreateBannerPayload, UpdateBannerPayload } from '../types'

export const useCreateBannerMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ data, file }: { data: CreateBannerPayload; file?: File }) =>
      bannersService.createBanner(data, file),
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
    mutationFn: ({ id, data, file }: { id: string; data: UpdateBannerPayload; file?: File }) =>
      bannersService.updateBanner(id, data, file),
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

export const useToggleBannerVisibilityMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isVisible }: { id: string; isVisible: boolean }) =>
      bannersService.updateBanner(id, { isVisible }),
    onSuccess: (_, { isVisible }) => {
      queryClient.invalidateQueries({ queryKey: ['banners'] })
      addToast({
        title: isVisible ? 'Banner activado' : 'Banner desactivado',
        color: 'success',
      })
    },
    onError: () => {
      addToast({ title: 'Error al cambiar visibilidad', color: 'danger' })
    },
  })
}

export const useReorderBannersMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (orderedIds: number[]) => bannersService.reorderBanners(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] })
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] })
      addToast({ title: 'Error al reordenar banners', color: 'danger' })
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
