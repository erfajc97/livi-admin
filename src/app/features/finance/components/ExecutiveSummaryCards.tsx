import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

interface ExecutiveSummaryCardsProps {
  totalIncome: number
  totalExpenses: number
  grossProfit: number
  profitMargin: number
}

export default function ExecutiveSummaryCards({
  totalIncome,
  totalExpenses,
  grossProfit,
  profitMargin,
}: ExecutiveSummaryCardsProps) {
  return (
    <div>
      <h2 className="mb-1 text-lg font-semibold text-text">Resumen Ejecutivo</h2>
      <p className="mb-4 text-xs text-text-muted">Métricas clave del periodo seleccionado</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Ingresos Totales */}
        <div className="rounded-xl border border-green-500/30 bg-surface p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-muted">Ingresos Totales</span>
            <TrendingUp size={20} className="text-green-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-text">
            $ {totalIncome.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Egresos Totales */}
        <div className="rounded-xl border border-red-500/30 bg-surface p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-muted">Egresos Totales</span>
            <TrendingDown size={20} className="text-red-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-text">
            $ {totalExpenses.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Utilidad Bruta */}
        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-muted">Utilidad Bruta</span>
            <DollarSign size={20} className="text-accent" />
          </div>
          <p className="mt-2 text-2xl font-bold text-text">
            ${grossProfit.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-sm text-text-muted">
            Margen de Ganancia <span className="font-semibold text-text">{profitMargin}%</span>
          </p>
        </div>
      </div>
    </div>
  )
}
