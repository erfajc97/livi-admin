import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'
import { categoriesService } from '../services/categoriesService'
import type { CreateCategoryPayload, UpdateCategoryPayload } from '../types'

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      data,
      file,
    }: {
      data: CreateCategoryPayload
      file?: File
    }) => categoriesService.createCategory(data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      addToast({ title: 'Categoría creada exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      addToast({
        title: error.message ?? 'Error al crear la categoría',
        color: 'danger',
      })
    },
  })
}

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
      file,
    }: {
      id: number
      data: UpdateCategoryPayload
      file?: File
    }) => categoriesService.updateCategory(id, data, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      addToast({
        title: 'Categoría actualizada exitosamente',
        color: 'success',
      })
    },
    onError: (error: Error) => {
      addToast({
        title: error.message ?? 'Error al actualizar la categoría',
        color: 'danger',
      })
    },
  })
}

export const useToggleCategoryActiveMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      categoriesService.updateCategory(id, { isActive }),
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      addToast({
        title: isActive ? 'Categoría activada' : 'Categoría desactivada',
        color: 'success',
      })
    },
    onError: () => {
      addToast({ title: 'Error al cambiar estado', color: 'danger' })
    },
  })
}

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => categoriesService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      addToast({ title: 'Categoría eliminada exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      addToast({
        title: error.message ?? 'Error al eliminar la categoría',
        color: 'danger',
      })
    },
  })
}
