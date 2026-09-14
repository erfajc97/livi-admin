import { Package } from 'lucide-react'

interface InventoryStockCardsProps {
  stock: number
  variationsCount: number
}

export default function InventoryStockCards({
  stock,
  variationsCount,
}: InventoryStockCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
          <Package size={20} className="text-accent" />
        </div>
        <p className="text-3xl font-bold text-accent">{stock}</p>
        <p className="text-xs text-text-muted uppercase tracking-wider font-bold">
          Unidades en stock
        </p>
        <p className="text-xs text-text-muted">
          {stock > 0 ? 'Disponible para la venta' : 'Agotado'}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
          <Package size={20} className="text-accent" />
        </div>
        <p className="text-3xl font-bold text-text">{variationsCount}</p>
        <p className="text-xs text-text-muted uppercase tracking-wider font-bold">
          Colores activos
        </p>
        <p className="text-xs text-text-muted">
          Las variantes comparten el stock del producto
        </p>
      </div>
    </div>
  )
}
