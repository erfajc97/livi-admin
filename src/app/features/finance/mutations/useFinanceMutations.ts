import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'
import { financeService } from '../services/financeService'
import type { CreateTransactionPayload, CreateBillPayload, UpdateBillPayload } from '../types'

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) => financeService.createTransaction(payload),
    onSuccess: () => {
      addToast({ title: 'Movimiento registrado', description: 'Se registró correctamente.', color: 'success' })
      void queryClient.invalidateQueries({ queryKey: ['finance-stats'] })
      void queryClient.invalidateQueries({ queryKey: ['finance-transactions'] })
    },
    onError: () => {
      addToast({ title: 'Error', description: 'No se pudo registrar el movimiento.', color: 'danger' })
    },
  })
}

export function useDeleteTransactionMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => financeService.deleteTransaction(id),
    onSuccess: () => {
      addToast({ title: 'Movimiento eliminado', color: 'success' })
      void queryClient.invalidateQueries({ queryKey: ['finance-stats'] })
      void queryClient.invalidateQueries({ queryKey: ['finance-transactions'] })
    },
    onError: () => {
      addToast({ title: 'Error', description: 'No se pudo eliminar.', color: 'danger' })
    },
  })
}

export function useCreateBillMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateBillPayload) => financeService.createBill(payload),
    onSuccess: () => {
      addToast({ title: 'Cuenta registrada', color: 'success' })
      void queryClient.invalidateQueries({ queryKey: ['finance-stats'] })
      void queryClient.invalidateQueries({ queryKey: ['finance-bills'] })
    },
    onError: () => {
      addToast({ title: 'Error', description: 'No se pudo registrar la cuenta.', color: 'danger' })
    },
  })
}

export function useUpdateBillMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateBillPayload }) =>
      financeService.updateBill(id, payload),
    onSuccess: () => {
      addToast({ title: 'Cuenta actualizada', color: 'success' })
      void queryClient.invalidateQueries({ queryKey: ['finance-stats'] })
      void queryClient.invalidateQueries({ queryKey: ['finance-bills'] })
    },
    onError: () => {
      addToast({ title: 'Error', description: 'No se pudo actualizar.', color: 'danger' })
    },
  })
}
