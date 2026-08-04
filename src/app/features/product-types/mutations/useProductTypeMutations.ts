import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'
import { productTypesService } from '../services/productTypesService'
import type {
  CreateProductTypePayload,
  UpdateProductTypePayload,
} from '../types'

export const useCreateProductTypeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateProductTypePayload) =>
      productTypesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-types'] })
      addToast({
        title: 'Tipo de producto creado exitosamente',
        color: 'success',
      })
    },
    onError: (error: Error) => {
      addToast({
        title: error.message ?? 'Error al crear el tipo',
        color: 'danger',
      })
    },
  })
}

export const useUpdateProductTypeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: UpdateProductTypePayload
    }) => productTypesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-types'] })
      addToast({
        title: 'Tipo de producto actualizado exitosamente',
        color: 'success',
      })
    },
    onError: (error: Error) => {
      addToast({
        title: error.message ?? 'Error al actualizar el tipo',
        color: 'danger',
      })
    },
  })
}

export const useToggleProductTypeActiveMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      productTypesService.update(id, { isActive }),
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: ['product-types'] })
      addToast({
        title: isActive ? 'Tipo activado' : 'Tipo desactivado',
        color: 'success',
      })
    },
    onError: () => {
      addToast({ title: 'Error al cambiar estado', color: 'danger' })
    },
  })
}

export const useDeleteProductTypeMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => productTypesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-types'] })
      addToast({
        title: 'Tipo de producto eliminado exitosamente',
        color: 'success',
      })
    },
    onError: (error: Error) => {
      addToast({
        title: error.message ?? 'Error al eliminar el tipo',
        color: 'danger',
      })
    },
  })
}
