import { createFileRoute } from '@tanstack/react-router'
import { Categorias } from '@/app/features/categories/Categorias'

export const Route = createFileRoute('/_authenticated/categorias')({
  component: Categorias,
})
