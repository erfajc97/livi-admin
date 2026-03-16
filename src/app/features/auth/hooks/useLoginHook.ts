import { useLoginMutation } from '../mutations/useLoginMutation'

export const useLoginHook = () => {
  const { mutateAsync: login, isPending } = useLoginMutation()

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      await login(values)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  return {
    handleLogin,
    isPending,
  }
}

