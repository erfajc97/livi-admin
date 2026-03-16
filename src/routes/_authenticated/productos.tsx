import { createFileRoute } from '@tanstack/react-router'
import { Products } from '@/app/features/products/Products'

export const Route = createFileRoute('/_authenticated/productos')({
  component: Products,
})
