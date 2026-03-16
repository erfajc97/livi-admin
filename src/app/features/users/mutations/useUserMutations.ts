import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'
import { usersService } from '../services/usersService'
import type { CreateUserPayload, UpdateUserPayload } from '../types'

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUserPayload) => usersService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      addToast({ title: 'Usuario creado exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      const message = error.message ?? 'Error al crear el usuario'
      addToast({ title: message, color: 'danger' })
    },
  })
}

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserPayload }) =>
      usersService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      addToast({ title: 'Usuario actualizado exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      const message = error.message ?? 'Error al actualizar el usuario'
      addToast({ title: message, color: 'danger' })
    },
  })
}

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      addToast({ title: 'Usuario eliminado exitosamente', color: 'success' })
    },
    onError: (error: Error) => {
      const message = error.message ?? 'Error al eliminar el usuario'
      addToast({ title: message, color: 'danger' })
    },
  })
}
