import { Button, Spinner } from '@heroui/react'
import FinanceWelcomeBanner from './FinanceWelcomeBanner'
import FinanceReminders from './FinanceReminders'
import FinanceMetricCards from './FinanceMetricCards'
import TransactionForm from './TransactionForm'
import BillsList from './BillsList'
import type { FinanceStats, TransactionFormData } from '../types'

interface FinanceManagementViewProps {
  stats: FinanceStats | undefined
  isLoading: boolean
  activeTab: 'transaction' | 'bills'
  formData: TransactionFormData
  isSubmitting: boolean
  onSetActiveTab: (tab: 'transaction' | 'bills') => void
  onUpdateField: <K extends keyof TransactionFormData>(
    key: K,
    value: TransactionFormData[K],
  ) => void
  onSubmitTransaction: () => void
  onMarkBillPaid: (id: number) => void
  onGoToDashboard: () => void
}

export default function FinanceManagementView({
  stats,
  isLoading,
  activeTab,
  formData,
  isSubmitting,
  onSetActiveTab,
  onUpdateField,
  onSubmitTransaction,
  onMarkBillPaid,
  onGoToDashboard,
}: FinanceManagementViewProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner size="lg" color="warning" />
      </div>
    )
  }

  if (!stats) {
    return (
      <p className="p-6 text-text-muted">No se pudieron cargar los datos.</p>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <FinanceWelcomeBanner
        title="Bienvenido al Dashboard Finanzas"
        subtitle="Gestión de Egresos y cuentas por pagar"
        buttonLabel="Ir a Resumen Ejecutivo"
        onButtonPress={onGoToDashboard}
      />

      <FinanceReminders
        overdueCount={stats.bills.overdueCount}
        overdueTotal={stats.bills.overdue.reduce(
          (s, b) => s + Number(b.amount),
          0,
        )}
        upcomingCount={stats.bills.upcomingCount}
      />

      <FinanceMetricCards
        expensesMonth={stats.expensesMonth}
        pendingTotal={stats.bills.pendingTotal}
        upcomingCount={stats.bills.upcomingCount}
      />

      {/* Tabs */}
      <div className="flex gap-0">
        <Button
          variant={activeTab === 'transaction' ? 'solid' : 'bordered'}
          color="default"
          onPress={() => onSetActiveTab('transaction')}
          className={`rounded-r-none font-semibold ${activeTab === 'transaction' ? 'bg-bg text-text' : ''}`}
        >
          Nuevo Egreso
        </Button>
        <Button
          variant={activeTab === 'bills' ? 'solid' : 'bordered'}
          color="default"
          onPress={() => onSetActiveTab('bills')}
          className={`rounded-l-none font-semibold ${activeTab === 'bills' ? 'bg-bg text-text' : ''}`}
        >
          Cuentas por Pagar
        </Button>
      </div>

      {activeTab === 'transaction' && (
        <TransactionForm
          formData={formData}
          isSubmitting={isSubmitting}
          onUpdateField={onUpdateField}
          onSubmit={onSubmitTransaction}
        />
      )}

      {activeTab === 'bills' && (
        <BillsList bills={stats.bills.all} onMarkPaid={onMarkBillPaid} />
      )}
    </div>
  )
}
