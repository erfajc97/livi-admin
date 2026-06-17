import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'
import { combosService } from '../services/combosService'

// Extended payload type to include image file
interface CreateComboPayloadWithFile {
  name: string
  description?: string
  imageUrl?: string
  imageFile?: File | null
  finalPrice: number
  discount?: number
  isActive?: boolean
  parentComboId?: number
  products: { productId: number; productVariationId?: number; quantity: number }[]
}

interface UpdateComboPayloadWithFile extends Partial<CreateComboPayloadWithFile> {}

export function useCreateComboMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateComboPayloadWithFile) => combosService.createCombo(payload),
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
    mutationFn: ({ id, data }: { id: number; data: UpdateComboPayloadWithFile }) =>
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
