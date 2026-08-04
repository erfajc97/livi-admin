import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'
import { manualSalesService } from '../services/manualSalesService'

export function useCreateManualOrderMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: manualSalesService.createManualOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      queryClient.invalidateQueries({ queryKey: ['finance'] })
      queryClient.invalidateQueries({ queryKey: ['finance-stats'] })
      addToast({
        title: `Venta registrada: ${data.orderNumber}`,
        description: `Total: $${data.total}`,
        color: 'success',
      })
    },
    onError: (error: Error) => {
      addToast({
        title: error.message ?? 'Error al registrar la venta',
        color: 'danger',
      })
    },
  })
}
