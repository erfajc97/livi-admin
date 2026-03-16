import { useState } from 'react'
import { useFinanceDashboardHook } from './hooks/useFinanceDashboardHook'
import { useFinanceManagementHook } from './hooks/useFinanceManagementHook'
import FinanceDashboardView from './components/FinanceDashboardView'
import FinanceManagementView from './components/FinanceManagementView'
import MovimientosTable from './components/MovimientosTable'

export function Finanzas() {
  const [view, setView] = useState<'dashboard' | 'management'>('dashboard')

  const dashboard = useFinanceDashboardHook()
  const management = useFinanceManagementHook()

  return (
    <div className="flex flex-col gap-6 p-6">
      {view === 'dashboard' ? (
        <FinanceDashboardView
          stats={dashboard.stats}
          isLoading={dashboard.isLoading}
          monthLabel={dashboard.monthLabel}
          onGoToManagement={() => setView('management')}
          onMarkBillPaid={management.handleMarkBillPaid}
        />
      ) : (
        <FinanceManagementView
          stats={dashboard.stats}
          isLoading={dashboard.isLoading}
          activeTab={management.activeTab}
          formData={management.formData}
          isSubmitting={management.isSubmitting}
          onSetActiveTab={management.setActiveTab}
          onUpdateField={management.updateField}
          onSubmitTransaction={management.handleSubmitTransaction}
          onMarkBillPaid={management.handleMarkBillPaid}
          onGoToDashboard={() => setView('dashboard')}
        />
      )}

      {/* Movimientos table at the bottom of both views */}
      {dashboard.stats && (
        <MovimientosTable transactions={dashboard.stats.transactions} />
      )}
    </div>
  )
}
