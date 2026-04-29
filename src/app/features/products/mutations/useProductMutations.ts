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

export function useOpenBottleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, mlRemaining, note }: { productId: number; mlRemaining?: number; note?: string }) =>
      productsService.openBottle(productId, { mlRemaining, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      addToast({ title: 'Botella abierta exitosamente', color: 'success' })
    },
    onError: (error: any) => {
      addToast({ title: error?.response?.data?.message ?? 'Error al abrir botella', color: 'danger' })
    },
  })
}

export function useAdjustMlMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, newOpenMl, note }: { productId: number; newOpenMl: number; note?: string }) =>
      productsService.adjustMl(productId, { newOpenMl, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      addToast({ title: 'ML ajustados exitosamente', color: 'success' })
    },
    onError: (error: any) => {
      addToast({ title: error?.response?.data?.message ?? 'Error al ajustar ML', color: 'danger' })
    },
  })
}
