import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/stock')({
  component: StockPage,
})

function StockPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide text-accent">
        Stock
      </h1>
      <p className="mt-2 text-text-muted">Gestión de productos e inventario.</p>
      {/* TODO: montar <Stock /> feature */}
    </div>
  )
}
