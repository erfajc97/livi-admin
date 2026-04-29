import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'
import { newsletterService } from '../services/newsletterService'
import type { CreateCampaignPayload, UpdateCampaignPayload } from '../types'

export const useDeleteSubscriberMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => newsletterService.deleteSubscriber(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter', 'subscribers'] })
      addToast({ title: 'Suscriptor eliminado exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      const message = error.message ?? 'Error al eliminar el suscriptor'
      addToast({ title: message, color: 'danger' })
    },
  })
}

export const useCreateCampaignMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateCampaignPayload) => newsletterService.createCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter', 'campaigns'] })
      addToast({ title: 'Campaña creada exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      const message = error.message ?? 'Error al crear la campaña'
      addToast({ title: message, color: 'danger' })
    },
  })
}

export const useUpdateCampaignMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCampaignPayload }) =>
      newsletterService.updateCampaign(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter', 'campaigns'] })
      addToast({ title: 'Campaña actualizada exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      const message = error.message ?? 'Error al actualizar la campaña'
      addToast({ title: message, color: 'danger' })
    },
  })
}

export const useDeleteCampaignMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => newsletterService.deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter', 'campaigns'] })
      addToast({ title: 'Campaña eliminada exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      const message = error.message ?? 'Error al eliminar la campaña'
      addToast({ title: message, color: 'danger' })
    },
  })
}

export const useSendCampaignMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => newsletterService.sendCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter', 'campaigns'] })
      addToast({ title: 'Campaña enviada exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      const message = error.message ?? 'Error al enviar la campaña'
      addToast({ title: message, color: 'danger' })
    },
  })
}
