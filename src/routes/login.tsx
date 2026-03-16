import { createFileRoute, redirect } from '@tanstack/react-router'
import { Login } from '@/app/features/auth/Login'

export const Route = createFileRoute('/login')({
   beforeLoad: ({ context }) => {
    if (context.auth.isLogged() && context.auth.roles?.toUpperCase() === 'ADMIN') {
      throw redirect({
        to: '/',
      })
    }
  },
  component: Login,
})
