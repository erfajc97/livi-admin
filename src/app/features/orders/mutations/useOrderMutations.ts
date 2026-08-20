import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'
import axiosInstance from '@/app/config/axiosConfig'
import { API_ENDPOINTS } from '@/app/api/endpoints'
import { ordersService } from '../services/ordersService'
import type { UpdateOrderPayload } from '../types'

interface ReconcileResponse {
  scanned: number
  confirmed: number
  stillPending: number
  errors: number
}

export function useUpdateOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateOrderPayload
    }) => ordersService.update(id, payload),
    onSuccess: () => {
      addToast({
        title: 'Orden actualizada',
        description: 'El estado se actualizó correctamente.',
        color: 'success',
      })
      void queryClient.invalidateQueries({ queryKey: ['orders'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: () => {
      addToast({
        title: 'Error',
        description: 'No se pudo actualizar la orden.',
        color: 'danger',
      })
    },
  })
}

export function useReconcilePayphoneMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (): Promise<ReconcileResponse> => {
      const { data } = await axiosInstance.post<{ data: ReconcileResponse }>(
        `${API_ENDPOINTS.PAYMENTS}/admin/reconcile`,
      )
      return data.data ?? (data as unknown as ReconcileResponse)
    },
    onSuccess: (result) => {
      const { scanned, confirmed, stillPending, errors } = result
      addToast({
        title: 'Reconciliación completada',
        description: `Revisadas: ${scanned} · Confirmadas: ${confirmed} · Pendientes: ${stillPending} · Errores: ${errors}`,
        color: confirmed > 0 ? 'success' : 'default',
      })
      void queryClient.invalidateQueries({ queryKey: ['orders'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: () => {
      addToast({
        title: 'Error',
        description: 'No se pudo reconciliar pagos pendientes.',
        color: 'danger',
      })
    },
  })
}

export function useResetOrdersMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => ordersService.resetAll(),
    onSuccess: (result) => {
      addToast({
        title: 'Órdenes reiniciadas',
        description:
          `${result.ordersDeleted} órdenes, ${result.itemsDeleted} items y ` +
          `${result.transactionsDeleted} transacciones borradas. ` +
          'El stock descontado no se devuelve: ajústalo en inventario.',
        color: 'success',
        timeout: 10000,
      })
      void queryClient.invalidateQueries({ queryKey: ['orders'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      void queryClient.invalidateQueries({ queryKey: ['finance'] })
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })
        ?.response?.data?.message
      addToast({
        title: 'Error',
        description: message ?? 'No se pudieron reiniciar las órdenes.',
        color: 'danger',
      })
    },
  })
}

export function useDeleteOrderMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => ordersService.remove(id),
    onSuccess: () => {
      addToast({
        title: 'Orden eliminada',
        description: 'La orden fue eliminada correctamente.',
        color: 'success',
      })
      void queryClient.invalidateQueries({ queryKey: ['orders'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: () => {
      addToast({
        title: 'Error',
        description: 'No se pudo eliminar la orden.',
        color: 'danger',
      })
    },
  })
}
