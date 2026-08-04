import { Button, Chip } from '@heroui/react'
import type { Bill } from '../types'

interface BillsListProps {
  bills: Bill[]
  onMarkPaid: (id: number) => void
  inline?: boolean
}

function getBillStatusInfo(bill: Bill) {
  const today = new Date().toISOString().split('T')[0]
  const dueDate = bill.dueDate

  if (bill.status === 'paid')
    return { label: 'Pagado', color: 'success' as const }
  if (dueDate < today) {
    const diff = Math.ceil(
      (new Date(today).getTime() - new Date(dueDate).getTime()) /
        (1000 * 60 * 60 * 24),
    )
    return { label: `${diff}d vencido`, color: 'danger' as const }
  }
  const diff = Math.ceil(
    (new Date(dueDate).getTime() - new Date(today).getTime()) /
      (1000 * 60 * 60 * 24),
  )
  if (diff <= 7)
    return { label: `${diff}d restantes`, color: 'warning' as const }
  return { label: 'Al día', color: 'success' as const }
}

function BillCards({
  bills,
  onMarkPaid,
}: {
  bills: Bill[]
  onMarkPaid: (id: number) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      {bills.map((bill) => {
        const statusInfo = getBillStatusInfo(bill)
        const isOverdue = statusInfo.color === 'danger'

        return (
          <div
            key={bill.id}
            className={`flex items-center justify-between rounded-lg border p-4 ${
              isOverdue
                ? 'border-red-500/30 bg-red-500/5'
                : 'border-border bg-surface-raised'
            }`}
          >
            <div className="flex-1">
              <p className="text-sm font-semibold text-text">{bill.name}</p>
              <p className="text-xs text-text-muted">
                {bill.bank} - Vence{' '}
                {new Date(bill.dueDate + 'T00:00:00').toLocaleDateString(
                  'es-EC',
                  {
                    day: 'numeric',
                    month: 'long',
                  },
                )}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Chip
                  size="sm"
                  variant="flat"
                  color={
                    statusInfo.color === 'danger'
                      ? 'danger'
                      : statusInfo.color === 'warning'
                        ? 'warning'
                        : 'success'
                  }
                >
                  {isOverdue
                    ? 'Vencido'
                    : statusInfo.color === 'warning'
                      ? 'Próximo a vencer'
                      : 'Al día'}
                </Chip>
                <span className="text-xs text-text-muted">
                  {statusInfo.label}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-text">
                ${Number(bill.amount).toFixed(2)}
              </span>
              <Button
                size="sm"
                variant="bordered"
                onPress={() => onMarkPaid(bill.id)}
              >
                Marcar como pago
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function BillsList({
  bills,
  onMarkPaid,
  inline = false,
}: BillsListProps) {
  const unpaidBills = bills.filter((b) => b.status !== 'paid')

  if (unpaidBills.length === 0) {
    if (inline) {
      return (
        <p className="text-sm text-text-muted">No hay cuentas pendientes.</p>
      )
    }
    return (
      <div className="h-full rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-3 text-sm font-semibold text-text">
          Cuentas por Pagar
        </h3>
        <p className="text-sm text-text-muted">No hay cuentas pendientes.</p>
      </div>
    )
  }

  if (inline) {
    return <BillCards bills={unpaidBills} onMarkPaid={onMarkPaid} />
  }

  return (
    <div className="h-full rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-3 text-sm font-semibold text-text">
        Cuentas por Pagar
      </h3>
      <BillCards bills={unpaidBills} onMarkPaid={onMarkPaid} />
    </div>
  )
}
