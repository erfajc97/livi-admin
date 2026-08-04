import { createFileRoute, redirect } from '@tanstack/react-router'
import { Users } from '@/app/features/users/Users'

export const Route = createFileRoute('/_authenticated/usuarios')({
  beforeLoad: ({ context }) => {
    if (context.auth.roles.toUpperCase() !== 'ADMIN') {
      throw redirect({
        to: '/notAuthorized',
      })
    }
  },
  component: Users,
})
