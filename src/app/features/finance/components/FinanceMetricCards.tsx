import { TrendingDown, Clock, CalendarClock } from 'lucide-react'

interface FinanceMetricCardsProps {
  expensesMonth: number
  pendingTotal: number
  upcomingCount: number
}

export default function FinanceMetricCards({
  expensesMonth,
  pendingTotal,
  upcomingCount,
}: FinanceMetricCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="flex min-w-0 items-center gap-4 rounded-xl border border-border bg-surface p-5">
        {/* Colores crudos de Tailwind → tokens semánticos de la paleta LIVI */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error/20">
          <TrendingDown size={20} className="text-error" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-text-muted">Egresos del mes</p>
          <p className="break-words text-lg font-bold text-text">
            $
            {expensesMonth.toLocaleString('es-EC', {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-4 rounded-xl border border-border bg-surface p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning/20">
          <Clock size={20} className="text-warning" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-text-muted">Pendientes</p>
          <p className="break-words text-lg font-bold text-text">
            $
            {pendingTotal.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-4 rounded-xl border border-border bg-surface p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20">
          <CalendarClock size={20} className="text-accent" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-text-muted">Pagos próximos 7 días</p>
          <p className="break-words text-lg font-bold text-text">
            {upcomingCount} pago{upcomingCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  )
}
