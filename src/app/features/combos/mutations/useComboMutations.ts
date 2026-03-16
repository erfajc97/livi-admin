import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'
import { combosService } from '../services/combosService'
import type { CreateComboPayload, UpdateComboPayload } from '../types'

export function useCreateComboMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateComboPayload) => combosService.createCombo(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combos'] })
      addToast({ title: 'Combo creado exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      addToast({ title: error.message ?? 'Error al crear el combo', color: 'danger' })
    },
  })
}

export function useUpdateComboMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateComboPayload }) =>
      combosService.updateCombo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combos'] })
      addToast({ title: 'Combo actualizado exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      addToast({ title: error.message ?? 'Error al actualizar el combo', color: 'danger' })
    },
  })
}

export function useDeleteComboMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => combosService.deleteCombo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combos'] })
      addToast({ title: 'Combo eliminado exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      addToast({ title: error.message ?? 'Error al eliminar el combo', color: 'danger' })
    },
  })
}
