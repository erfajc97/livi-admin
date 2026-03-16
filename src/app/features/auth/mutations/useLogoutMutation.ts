import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/app/store/auth/authStore'

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      // Add any API call here if necessary, e.g., authService.logout()
    },
    onSuccess: () => {
      useAuthStore.getState().removeToken()
      queryClient.clear()
    },
    onError: (error) => {
      console.error('Logout error:', error)
      // Force remove token anyway to prevent stuck states
      useAuthStore.getState().removeToken()
    }
  })
}
