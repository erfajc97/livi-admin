import { Input } from '@heroui/react'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Store,
} from 'lucide-react'
import CashFlowChart from './CashFlowChart'
import ExpenseDistributionChart from './ExpenseDistributionChart'
import IncomeVsExpenseChart from './IncomeVsExpenseChart'
import OtherIncomeForm from './OtherIncomeForm'
import type { FinanceStats } from '../types'

interface FinanceResumenTabProps {
  stats: FinanceStats | null
  monthLabel: string
  month: string
  onMonthChange: (month: string) => void
}

export default function FinanceResumenTab({
  stats,
  monthLabel,
  month,
  onMonthChange,
}: FinanceResumenTabProps) {
  if (!stats)
    return <p className="text-text-muted">No hay datos disponibles.</p>

  return (
    <div className="flex flex-col gap-6">
      {/* Month selector */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-heading font-bold text-text">
          {monthLabel}
        </h2>
        <Input
          type="month"
          value={month}
          onValueChange={onMonthChange}
          classNames={{
            base: 'w-full sm:max-w-40',
            input: '!text-text',
            inputWrapper: 'bg-surface-raised border-border',
          }}
          size="sm"
        />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="min-w-0 rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <TrendingUp size={16} className="text-green-500" />
            </div>
            <span className="text-xs text-text-muted font-bold uppercase">
              Ingresos
            </span>
          </div>
          <p className="text-2xl font-bold text-green-500">
            ${stats.totalIncome.toFixed(2)}
          </p>
        </div>

        <div className="min-w-0 rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
              <TrendingDown size={16} className="text-red-400" />
            </div>
            <span className="text-xs text-text-muted font-bold uppercase">
              Egresos
            </span>
          </div>
          <p className="text-2xl font-bold text-red-400">
            ${stats.totalExpenses.toFixed(2)}
          </p>
        </div>

        <div className="min-w-0 rounded-xl border border-accent/30 bg-accent/5 p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <DollarSign size={16} className="text-accent" />
            </div>
            <span className="text-xs text-text-muted font-bold uppercase">
              Ganancia Neta
            </span>
          </div>
          <p
            className={`text-2xl font-bold ${stats.grossProfit >= 0 ? 'text-accent' : 'text-red-400'}`}
          >
            ${stats.grossProfit.toFixed(2)}
          </p>
          <p className="text-xs text-text-muted mt-1">
            Margen: {stats.profitMargin}%
          </p>
        </div>
      </div>

      {/* Income breakdown */}
      <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
        <h3 className="text-sm font-heading font-bold text-text uppercase tracking-wider mb-4">
          Desglose de Ingresos
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex min-w-0 items-center gap-3 p-3 rounded-lg bg-bg">
            <ShoppingCart size={18} className="shrink-0 text-blue-400" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-text">
                ${(stats.onlineSalesTotal ?? 0).toFixed(2)}
              </p>
              <p className="text-xs text-text-muted">
                {stats.onlineSalesCount ?? 0} ventas web
              </p>
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-3 p-3 rounded-lg bg-bg">
            <Store size={18} className="shrink-0 text-purple-400" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-text">
                ${(stats.manualSalesTotal ?? 0).toFixed(2)}
              </p>
              <p className="text-xs text-text-muted">
                {stats.manualSalesCount ?? 0} ventas manuales
              </p>
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-3 p-3 rounded-lg bg-bg">
            <DollarSign size={18} className="shrink-0 text-green-400" />
            <div className="min-w-0">
              <p className="text-sm font-bold text-text">
                ${(stats.manualIncome ?? 0).toFixed(2)}
              </p>
              <p className="text-xs text-text-muted">Otros ingresos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Otros ingresos form */}
      <OtherIncomeForm />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="min-w-0">
          <CashFlowChart data={stats.cashFlow ?? []} />
        </div>
        <div className="min-w-0 flex flex-col gap-6">
          <IncomeVsExpenseChart
            totalIncome={stats.totalIncome}
            totalExpenses={stats.totalExpenses}
          />
          <ExpenseDistributionChart
            expensesByCategory={stats.expensesByCategory}
          />
        </div>
      </div>
    </div>
  )
}
