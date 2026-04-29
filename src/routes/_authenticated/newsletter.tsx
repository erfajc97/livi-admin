import { createFileRoute } from '@tanstack/react-router'
import { Newsletter } from '@/app/features/newsletter/Newsletter'

export const Route = createFileRoute('/_authenticated/newsletter')({
  component: Newsletter,
})
