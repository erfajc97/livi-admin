import { createFileRoute } from '@tanstack/react-router'
import LandingSectionsPage from '@/app/features/landing-sections/pages/LandingSectionsPage'

export const Route = createFileRoute('/_authenticated/secciones-landing')({
  component: LandingSectionsPage,
})
