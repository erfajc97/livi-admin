import { createFileRoute } from '@tanstack/react-router'
import { Banners } from '@/app/features/banners/Banners'

export const Route = createFileRoute('/_authenticated/banners')({
  component: Banners,
})
