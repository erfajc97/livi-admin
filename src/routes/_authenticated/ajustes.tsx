import { createFileRoute, redirect } from '@tanstack/react-router'
import { Settings } from '@/app/features/settings/Settings'

export const Route = createFileRoute('/_authenticated/ajustes')({
  beforeLoad: ({ context }) => {
    if (context.auth.roles.toUpperCase() !== 'ADMIN') {
      throw redirect({
        to: '/notAuthorized',
      })
    }
  },
  component: Settings,
})
