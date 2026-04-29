import { createFileRoute } from '@tanstack/react-router'
import Inventory from '@/app/features/inventory/Inventory'

export const Route = createFileRoute('/_authenticated/stock')({
  component: StockPage,
})

function StockPage() {
  return <Inventory />
}
