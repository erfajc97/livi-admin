import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'
import { ordersService } from '../services/ordersService'
import type { UpdateOrderPayload } from '../types'

export function useUpdateOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateOrderPayload }) =>
      ordersService.update(id, payload),
    onSuccess: () => {
      addToast({ title: 'Orden actualizada', description: 'El estado se actualizó correctamente.', color: 'success' })
      void queryClient.invalidateQueries({ queryKey: ['orders'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: () => {
      addToast({ title: 'Error', description: 'No se pudo actualizar la orden.', color: 'danger' })
    },
  })
}

export function useDeleteOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => ordersService.remove(id),
    onSuccess: () => {
      addToast({ title: 'Orden eliminada', description: 'La orden fue eliminada correctamente.', color: 'success' })
      void queryClient.invalidateQueries({ queryKey: ['orders'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: () => {
      addToast({ title: 'Error', description: 'No se pudo eliminar la orden.', color: 'danger' })
    },
  })
}
