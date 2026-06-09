import { createFileRoute } from '@tanstack/react-router'
import { PublicidadNavbar } from '@/app/features/publicidad-navbar/PublicidadNavbar'

export const Route = createFileRoute('/_authenticated/publicidad-navbar')({
  component: PublicidadNavbar,
})
