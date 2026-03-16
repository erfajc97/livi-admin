import { Clock } from 'lucide-react'

interface BillsPendingCardProps {
  pendingTotal: number
  pendingCount: number
}

export default function BillsPendingCard({ pendingTotal, pendingCount }: BillsPendingCardProps) {
  return (
    <div className="h-full rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-muted">Cuentas por Pagar</span>
        <Clock size={20} className="text-yellow-500" />
      </div>
      <p className="mt-2 text-2xl font-bold text-text">
        $ {pendingTotal.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
      </p>
      <p className="mt-1 text-sm text-text-muted">
        {pendingCount} cuenta{pendingCount !== 1 ? 's' : ''} por pagar pendientes
      </p>
    </div>
  )
}
