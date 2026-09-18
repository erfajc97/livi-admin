import { Spinner } from '@heroui/react'
import { Clock, AlertTriangle, CalendarClock } from 'lucide-react'
import FinanceWelcomeBanner from './FinanceWelcomeBanner'
import FinanceReminders from './FinanceReminders'
import ExecutiveSummaryCards from './ExecutiveSummaryCards'
import BillsList from './BillsList'
import CashFlowChart from './CashFlowChart'
import ExpenseDistributionChart from './ExpenseDistributionChart'
import type { FinanceStats } from '../types'

interface FinanceDashboardViewProps {
  stats: FinanceStats | undefined
  isLoading: boolean
  monthLabel: string
  onGoToManagement: () => void
  onMarkBillPaid: (id: number) => void
}

export default function FinanceDashboardView({
  stats,
  isLoading,
  monthLabel,
  onGoToManagement,
  onMarkBillPaid,
}: FinanceDashboardViewProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner size="lg" color="warning" />
      </div>
    )
  }

  if (!stats) {
    return (
      <p className="p-6 text-text-muted">
        No se pudieron cargar las estadísticas.
      </p>
    )
  }

  const overdueTotal = stats.bills.overdue.reduce(
    (s, b) => s + Number(b.amount),
    0,
  )
  const upcomingTotal = stats.bills.upcoming.reduce(
    (s, b) => s + Number(b.amount),
    0,
  )

  return (
    <div className="flex flex-col gap-6">
      <FinanceWelcomeBanner
        title="Bienvenido al Dashboard Finanzas"
        subtitle={`Mostrando: ${monthLabel}`}
        buttonLabel="Ir A mis Finanzas"
        onButtonPress={onGoToManagement}
      />

      <FinanceReminders
        overdueCount={stats.bills.overdueCount}
        overdueTotal={overdueTotal}
        upcomingCount={stats.bills.upcomingCount}
      />

      <ExecutiveSummaryCards
        totalIncome={stats.totalIncome}
        totalExpenses={stats.totalExpenses}
        grossProfit={stats.grossProfit}
        profitMargin={stats.profitMargin}
      />

      {/* Cuentas por Pagar — sección unificada */}
      <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-base font-semibold uppercase tracking-wide text-text">
            Cuentas por Pagar
          </h3>
          <Clock size={20} className="text-warning" />
        </div>

        {/* Mini resumen horizontal */}
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex min-w-0 items-center gap-3 rounded-lg border border-border bg-bg-alt p-3">
            <Clock size={18} className="shrink-0 text-warning" />
            <div className="min-w-0">
              <p className="text-xs text-text-muted">Total pendiente</p>
              <p className="break-words text-lg font-bold text-text">
                $
                {stats.bills.pendingTotal.toLocaleString('es-EC', {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-text-muted">
                {stats.bills.pendingCount} cuenta
                {stats.bills.pendingCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-3 rounded-lg border border-error/30 bg-error/5 p-3">
            <AlertTriangle size={18} className="shrink-0 text-error" />
            <div className="min-w-0">
              <p className="text-xs text-text-muted">Vencidas</p>
              <p className="break-words text-lg font-bold text-error">
                $
                {overdueTotal.toLocaleString('es-EC', {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-text-muted">
                {stats.bills.overdueCount} cuenta
                {stats.bills.overdueCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-3 rounded-lg border border-warning/30 bg-warning/5 p-3">
            <CalendarClock size={18} className="shrink-0 text-warning" />
            <div className="min-w-0">
              <p className="text-xs text-text-muted">Próximas a vencer</p>
              <p className="break-words text-lg font-bold text-warning">
                $
                {upcomingTotal.toLocaleString('es-EC', {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-text-muted">
                {stats.bills.upcomingCount} cuenta
                {stats.bills.upcomingCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Lista de bills dentro de la misma sección */}
        <BillsList bills={stats.bills.all} onMarkPaid={onMarkBillPaid} inline />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <CashFlowChart data={stats.cashFlow} />
        </div>

        <div className="min-w-0 rounded-xl border border-border bg-surface p-4 sm:p-5">
          <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wide text-text">
            Por Método de Pago
          </h3>
          <div className="flex flex-col gap-2">
            {['Payphone', 'Transferencia', 'Efectivo', 'T. Crédito'].map(
              (method) => {
                const total = stats.transactions
                  .filter(
                    (t) => t.type === 'expense' && t.paymentMethod === method,
                  )
                  .reduce((s, t) => s + Number(t.amount), 0)
                const maxVal = stats.totalExpenses || 1
                const pct = (total / maxVal) * 100

                return (
                  <div key={method} className="flex min-w-0 items-center gap-3">
                    <span className="w-20 shrink-0 truncate text-xs text-text-muted sm:w-28">
                      {method}
                    </span>
                    <div className="h-5 min-w-0 flex-1 overflow-hidden rounded-sm bg-bg-alt">
                      <div
                        className="h-full rounded-sm bg-success"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-16 shrink-0 text-right text-xs text-text-muted">
                      ${total.toFixed(0)}
                    </span>
                  </div>
                )
              },
            )}
          </div>
        </div>
      </div>

      <ExpenseDistributionChart expensesByCategory={stats.expensesByCategory} />
    </div>
  )
}
