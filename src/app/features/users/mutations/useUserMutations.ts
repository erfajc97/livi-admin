import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addToast } from '@heroui/react'
import { usersService } from '../services/usersService'
import type {
  CreateUserPayload,
  ResetPasswordPayload,
  UpdateUserPayload,
} from '../types'

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

/**
 * Restablecimiento hecho desde el panel. No invalida la lista de usuarios:
 * la contraseña no se muestra en la tabla y refrescar cerraría el modal
 * antes de que el admin pueda copiarla.
 */
export const useResetPasswordMutation = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: ResetPasswordPayload }) =>
      usersService.resetPassword(id, data),
    onSuccess: (result) => {
      addToast({
        title: result.notified
          ? 'Contraseña restablecida y enviada por correo'
          : 'Contraseña restablecida',
        color: 'success',
      })
    },
    onError: (error: Error) => {
      const message = error.message ?? 'Error al restablecer la contraseña'
      addToast({ title: message, color: 'danger' })
    },
  })

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
