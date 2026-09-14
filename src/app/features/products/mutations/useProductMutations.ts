import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'
import { productsService } from '../services/productsService'
import type { CreateProductPayload, UpdateProductPayload } from '../types'

export function useCreateProductMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateProductPayload) =>
      productsService.createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: Error) => {
      addToast({
        title: error.message ?? 'Error al crear el producto',
        color: 'danger',
      })
    },
  })
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductPayload }) =>
      productsService.updateProduct(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] })
    },
    onError: (error: Error) => {
      addToast({
        title: error.message ?? 'Error al actualizar el producto',
        color: 'danger',
      })
    },
  })
}

/**
 * Mensaje real de la API. Axios deja en `error.message` un "Request failed with
 * status code 409" que no le dice nada al admin: el motivo (por ejemplo, que el
 * producto tiene pedidos) viaja en la respuesta.
 */
function apiErrorMessage(error: unknown, fallback: string): string {
  const message = (error as { response?: { data?: { message?: string | string[] } } })
    ?.response?.data?.message
  if (Array.isArray(message)) return message.join(' · ')
  return message || fallback
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, force }: { id: number; force?: boolean }) =>
      productsService.deleteProduct(id, force),
    onSuccess: (_data, { force }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      addToast({
        title: 'Producto eliminado exitosamente',
        description: force
          ? 'Los pedidos que lo incluían conservan precio y cantidad, pero ya no muestran el producto.'
          : undefined,
        color: 'success',
      })
    },
    onError: (error: unknown) => {
      addToast({
        title: apiErrorMessage(error, 'Error al eliminar el producto'),
        color: 'danger',
        timeout: 8000,
      })
    },
  })
}
