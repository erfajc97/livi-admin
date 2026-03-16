import { AlertCircle, AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'

interface FinanceRemindersProps {
  overdueCount: number
  overdueTotal: number
  upcomingCount: number
}

export default function FinanceReminders({
  overdueCount,
  overdueTotal,
  upcomingCount,
}: FinanceRemindersProps) {
  const [showOverdue, setShowOverdue] = useState(true)
  const [showUpcoming, setShowUpcoming] = useState(true)

  if (overdueCount === 0 && upcomingCount === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {overdueCount > 0 && showOverdue && (
        <div className="flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-red-500" />
            <span className="text-sm text-text">
              {overdueCount} Cuenta{overdueCount > 1 ? 's' : ''} Vencida{overdueCount > 1 ? 's' : ''} Total: ${overdueTotal.toFixed(2)}
            </span>
          </div>
          <button type="button" onClick={() => setShowOverdue(false)} className="text-text-muted hover:text-text">
            <X size={16} />
          </button>
        </div>
      )}

      {upcomingCount > 0 && showUpcoming && (
        <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} className="text-yellow-500" />
            <span className="text-sm text-text">
              Tienes {upcomingCount} Cuenta{upcomingCount > 1 ? 's' : ''} Próxima{upcomingCount > 1 ? 's' : ''} a vencer
            </span>
          </div>
          <button type="button" onClick={() => setShowUpcoming(false)} className="text-text-muted hover:text-text">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
