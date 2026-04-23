import { createFileRoute } from '@tanstack/react-router'
import { TiposProducto } from '@/app/features/product-types/TiposProducto'

export const Route = createFileRoute('/_authenticated/tipos-producto')({
  component: TiposProducto,
})
