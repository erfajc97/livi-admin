import { useState } from 'react'
import { Button, Spinner } from '@heroui/react'
import { BarChart3, CreditCard, Receipt, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { useFinanceDashboardHook } from './hooks/useFinanceDashboardHook'
import { useFinanceManagementHook } from './hooks/useFinanceManagementHook'
import FinanceResumenTab from './components/FinanceResumenTab'
import FinanceEgresosTab from './components/FinanceEgresosTab'
import FinanceCuentasTab from './components/FinanceCuentasTab'

type FinanceTab = 'resumen' | 'egresos' | 'cuentas'

const TABS: { key: FinanceTab; label: string; icon: typeof BarChart3 }[] = [
  { key: 'resumen', label: 'Resumen Financiero', icon: BarChart3 },
  { key: 'egresos', label: 'Egresos', icon: TrendingDown },
  { key: 'cuentas', label: 'Cuentas por Pagar', icon: CreditCard },
]

export function Finanzas() {
  const [tab, setTab] = useState<FinanceTab>('resumen')
  const dashboard = useFinanceDashboardHook()
  const management = useFinanceManagementHook()

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide text-accent">
          Finanzas
        </h1>
        <p className="text-sm text-text-muted">Control de ingresos, egresos y cuentas por pagar</p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-2 border-b border-border pb-0">
        {TABS.map((t) => {
          const Icon = t.icon
          const isActive = tab === t.key
          return (
            <Button
              key={t.key}
              variant="light"
              size="sm"
              startContent={<Icon size={14} />}
              onPress={() => setTab(t.key)}
              className={`rounded-none border-b-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                isActive
                  ? 'border-accent text-accent'
                  : 'border-transparent text-text-muted hover:text-text'
              }`}
            >
              {t.label}
            </Button>
          )
        })}
      </div>

      {/* Content */}
      {dashboard.isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" color="warning" />
        </div>
      ) : (
        <>
          {tab === 'resumen' && (
            <FinanceResumenTab
              stats={dashboard.stats}
              monthLabel={dashboard.monthLabel}
              month={dashboard.month}
              onMonthChange={dashboard.setMonth}
            />
          )}
          {tab === 'egresos' && (
            <FinanceEgresosTab
              stats={dashboard.stats}
              formData={management.formData}
              isSubmitting={management.isSubmitting}
              onUpdateField={management.updateField}
              onSubmit={management.handleSubmitTransaction}
            />
          )}
          {tab === 'cuentas' && (
            <FinanceCuentasTab
              stats={dashboard.stats}
              onMarkPaid={management.handleMarkBillPaid}
              onCreateBill={management.handleCreateBill}
            />
          )}
        </>
      )}
    </div>
  )
}
