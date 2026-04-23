import { createFileRoute } from '@tanstack/react-router'
import { Coupons } from '@/app/features/coupons/Coupons'

export const Route = createFileRoute('/_authenticated/cupones')({
  component: Coupons,
})
