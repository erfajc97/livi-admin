import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'
import { marcasService } from '../services/categoriesService'
import type { CreateMarcaPayload, UpdateMarcaPayload } from '../types'

export const useCreateMarcaMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      file,
      mobileFile,
      ...data
    }: CreateMarcaPayload & { file?: File; mobileFile?: File }) =>
      marcasService.create(data, file, mobileFile),
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
      mobileFile,
    }: {
      id: number
      data: UpdateMarcaPayload
      file?: File
      mobileFile?: File
    }) => marcasService.update(id, data, file, mobileFile),
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
