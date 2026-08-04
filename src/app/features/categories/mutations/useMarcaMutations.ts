import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'
import { marcasService } from '../services/categoriesService'
import type { CreateMarcaPayload, UpdateMarcaPayload } from '../types'

export const useCreateMarcaMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ file, ...data }: CreateMarcaPayload & { file?: File }) =>
      marcasService.create(data, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({
        queryKey: ['marcas', variables.categoryId],
      })
      addToast({ title: 'Marca creada exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      addToast({
        title: error.message ?? 'Error al crear la marca',
        color: 'danger',
      })
    },
  })
}

export const useUpdateMarcaMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
      file,
    }: {
      id: number
      data: UpdateMarcaPayload
      file?: File
    }) => marcasService.update(id, data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['marcas'] })
      addToast({ title: 'Marca actualizada exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      addToast({
        title: error.message ?? 'Error al actualizar la marca',
        color: 'danger',
      })
    },
  })
}

export const useDeleteMarcaMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => marcasService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['marcas'] })
      addToast({ title: 'Marca eliminada exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      addToast({
        title: error.message ?? 'Error al eliminar la marca',
        color: 'danger',
      })
    },
  })
}
