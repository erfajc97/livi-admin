import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { blogsService } from '../services/blogsService'

export function useCreateBlogMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: FormData) => blogsService.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      toast.success('Blog post creado exitosamente')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al crear blog post')
    },
  })
}

export function useUpdateBlogMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      blogsService.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      toast.success('Blog post actualizado exitosamente')
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Error al actualizar blog post',
      )
    },
  })
}

export function useDeleteBlogMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => blogsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
      toast.success('Blog post eliminado exitosamente')
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Error al eliminar blog post',
      )
    },
  })
}

export function useReorderBlogsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderedIds: number[]) => blogsService.reorder(orderedIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al reordenar blogs')
    },
  })
}
