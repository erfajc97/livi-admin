import { Package, Droplets, FlaskConical } from 'lucide-react'

interface InventoryStockCardsProps {
  stock: number
  openMl: number
  totalMl: number
  availableMl: number
}

export default function InventoryStockCards({
  stock,
  openMl,
  totalMl,
  availableMl,
}: InventoryStockCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="rounded-xl border border-border bg-surface p-5 flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
          <Package size={20} className="text-accent" />
        </div>
        <p className="text-3xl font-bold text-text">{stock}</p>
        <p className="text-xs text-text-muted uppercase tracking-wider font-bold">
          Botellas selladas
        </p>
        <p className="text-xs text-text-muted">{totalMl}ml c/u</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-5 flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
          <Droplets size={20} className="text-blue-400" />
        </div>
        <p className="text-3xl font-bold text-text">
          {openMl}
          <span className="text-lg text-text-muted">ml</span>
        </p>
        <p className="text-xs text-text-muted uppercase tracking-wider font-bold">
          Botella abierta
        </p>
        <p className="text-xs text-text-muted">
          {openMl > 0 ? 'En uso' : 'Sin abrir'}
        </p>
      </div>

      <div className="rounded-xl border border-accent/30 bg-accent/5 p-5 flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
          <FlaskConical size={20} className="text-accent" />
        </div>
        <p className="text-3xl font-bold text-accent">
          {availableMl}
          <span className="text-lg text-accent/60">ml</span>
        </p>
        <p className="text-xs text-text-muted uppercase tracking-wider font-bold">
          Total disponible
        </p>
        <p className="text-xs text-text-muted">
          {stock} x {totalMl}ml + {openMl}ml
        </p>
      </div>
    </div>
  )
}
