import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'
import { settingsService } from '../services/settingsService'

export const useUpdateSettingMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ key, value, description }: { key: string; value: string; description?: string }) =>
      settingsService.update(key, value, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      addToast({ title: 'Ajuste guardado exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      const message = error.message ?? 'Error al guardar el ajuste'
      addToast({ title: message, color: 'danger' })
    },
  })
}
