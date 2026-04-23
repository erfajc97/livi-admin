import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'
import { productsService } from '../services/productsService'
import type { CreateProductPayload, UpdateProductPayload } from '../types'

export function useCreateProductMutation() {
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => productsService.createProduct(payload),
    onError: (error: Error) => {
      addToast({ title: error.message ?? 'Error al crear el producto', color: 'danger' })
    },
  })
}

export function useUpdateProductMutation() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductPayload }) =>
      productsService.updateProduct(id, data),
    onError: (error: Error) => {
      addToast({ title: error.message ?? 'Error al actualizar el producto', color: 'danger' })
    },
  })
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => productsService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      addToast({ title: 'Producto eliminado exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      addToast({ title: error.message ?? 'Error al eliminar el producto', color: 'danger' })
    },
  })
}
