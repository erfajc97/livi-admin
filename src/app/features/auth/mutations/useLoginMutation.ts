import { useMutation } from '@tanstack/react-query'
import { authService } from '../services/authService'
import { useAuthStore } from '@/app/store/auth/authStore'
import { sonnerResponse } from '@/app/helpers/sonnerResponse'
import { useNavigate } from '@tanstack/react-router'

type LoginPayload = {
  email: string
  password: string
}

export const useLoginMutation = () => {
  const navigate = useNavigate({from: '/login'})
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const data = await authService.login(payload)
      // console.log(data)

      const token = data.accessToken
      const refreshToken = '' // Set a default if your API doesn't return one currently
      const decoded = JSON.parse(atob(token.split('.')[1]))
      const expiration = decoded.exp * 1000

      useAuthStore.getState().setToken(token, refreshToken, expiration)
      useAuthStore.getState().setRoles(data.user?.role)
      useAuthStore.getState().setUserInfo(
        `${data.user?.firstName ?? ''} ${data.user?.lastName ?? ''}`.trim(),
        data.user?.email ?? '',
      )

      return data
    },
    onSuccess: () => {
      sonnerResponse('Inicio de sesión exitoso', 'success')
      navigate({ to: '/' })
    },
    onError: (error: unknown) => {
      const axiosMsg = (error as { response?: { data?: { message?: string } } })?.response?.data?.message
      const fallback = error instanceof Error ? error.message : 'Error desconocido al iniciar sesión'
      sonnerResponse(axiosMsg || fallback, 'error')
    },
  })
}
