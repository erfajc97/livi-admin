import { useState, useMemo } from 'react'
import { Button, Input, Select, SelectItem, Textarea } from '@heroui/react'
import { Plus, Trash2, Calendar } from 'lucide-react'
import { useDeleteTransactionMutation } from '../mutations/useFinanceMutations'
import ExpenseDistributionChart from './ExpenseDistributionChart'
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../data'
import type { FinanceStats, TransactionFormData } from '../types'

type DateFilter = 'all' | 'today' | 'week' | 'month'

interface FinanceEgresosTabProps {
  stats: FinanceStats | null
  formData: TransactionFormData
  isSubmitting: boolean
  onUpdateField: <K extends keyof TransactionFormData>(
    key: K,
    value: TransactionFormData[K],
  ) => void
  onSubmit: () => void
}

const selectClasses = {
  label: '!text-text',
  popoverContent: 'bg-surface border border-border',
  listbox: 'text-text',
}
const inputClasses = {
  label: '!text-text',
  input: '!text-text',
  inputWrapper: 'bg-background border-border',
}

export default function FinanceEgresosTab({
  stats,
  formData,
  isSubmitting,
  onUpdateField,
  onSubmit,
}: FinanceEgresosTabProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [showForm, setShowForm] = useState(false)
  const deleteMutation = useDeleteTransactionMutation()

  const expenses = useMemo(() => {
    const all = (stats?.transactions ?? []).filter((t) => t.type === 'expense')

    if (dateFilter === 'all') return all

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    return all.filter((t) => {
      const d = new Date(t.date)
      if (dateFilter === 'today') return d >= today
      if (dateFilter === 'week') {
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        return d >= weekAgo
      }
      // month
      const monthAgo = new Date(today)
      monthAgo.setDate(monthAgo.getDate() - 30)
      return d >= monthAgo
    })
  }, [stats?.transactions, dateFilter])

  // Filtered expenses by category for pie chart
  const filteredByCategory: Record<string, number> = {}
  expenses.forEach((t) => {
    filteredByCategory[t.category] =
      (filteredByCategory[t.category] || 0) + Number(t.amount)
  })
  const filteredTotal = expenses.reduce((sum, t) => sum + Number(t.amount), 0)

  const handleSubmit = () => {
    onUpdateField('type', 'expense')
    onSubmit()
    setShowForm(false)
  }

  const DATE_FILTERS: { value: DateFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'today', label: 'Hoy' },
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mes' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header + Add button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-heading font-bold text-text">
            Registro de Egresos
          </h2>
          <p className="text-xs text-text-muted">
            Total filtrado:{' '}
            <strong className="text-red-400">
              ${filteredTotal.toFixed(2)}
            </strong>
          </p>
        </div>
        <Button
          color="warning"
          size="sm"
          startContent={<Plus size={14} />}
          onPress={() => setShowForm(!showForm)}
          className="w-full sm:w-auto"
        >
          Nuevo Egreso
        </Button>
      </div>

      {/* New expense form */}
      {showForm && (
        <div className="rounded-xl border border-accent/30 bg-surface p-4 sm:p-5">
          <h3 className="text-sm font-bold text-accent mb-4">
            Registrar gasto
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              label="Descripción"
              value={formData.description}
              onValueChange={(v) => onUpdateField('description', v)}
              classNames={inputClasses}
              isRequired
            />
            <Input
              label="Monto ($)"
              type="number"
              value={formData.amount}
              onValueChange={(v) => onUpdateField('amount', v)}
              classNames={inputClasses}
              isRequired
            />
            <Input
              label="Fecha"
              type="date"
              value={formData.date}
              onValueChange={(v) => onUpdateField('date', v)}
              classNames={inputClasses}
              isRequired
            />
            <Select
              label="Categoría"
              selectedKeys={formData.category ? [formData.category] : []}
              onSelectionChange={(k) =>
                onUpdateField('category', String(Array.from(k)[0] || ''))
              }
              classNames={selectClasses}
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <SelectItem key={c}>{c}</SelectItem>
              ))}
            </Select>
            <Select
              label="Método de pago"
              selectedKeys={
                formData.paymentMethod ? [formData.paymentMethod] : []
              }
              onSelectionChange={(k) =>
                onUpdateField('paymentMethod', String(Array.from(k)[0] || ''))
              }
              classNames={selectClasses}
            >
              {PAYMENT_METHODS.map((m) => (
                <SelectItem key={m}>{m}</SelectItem>
              ))}
            </Select>
            <div className="sm:col-span-2 lg:col-span-2">
              <Textarea
                label="Notas (opcional)"
                value={formData.notes}
                onValueChange={(v) => onUpdateField('notes', v)}
                classNames={{ label: '!text-text', input: '!text-text' }}
                minRows={1}
              />
            </div>
            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <Button
                color="warning"
                onPress={handleSubmit}
                isLoading={isSubmitting}
                className="w-full"
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Date filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Calendar size={14} className="text-text-muted" />
        {DATE_FILTERS.map((f) => (
          <Button
            key={f.value}
            size="sm"
            variant={dateFilter === f.value ? 'solid' : 'flat'}
            color={dateFilter === f.value ? 'warning' : 'default'}
            onPress={() => setDateFilter(f.value)}
            className="min-w-0 px-3 text-xs"
          >
            {f.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense list */}
        <div className="min-w-0 rounded-xl border border-border bg-surface p-4 sm:p-5">
          <h3 className="text-sm font-heading font-bold text-text uppercase tracking-wider mb-3">
            Listado de egresos
          </h3>
          {expenses.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-6">
              No hay egresos en este período.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-border max-h-96 overflow-y-auto">
              {expenses.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-3 py-3 px-1"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text truncate">
                      {t.description || t.category}
                    </p>
                    <p className="text-xs text-text-muted">
                      {t.category} · {t.date} · {t.paymentMethod || '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-red-400">
                      -${Number(t.amount).toFixed(2)}
                    </span>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => deleteMutation.mutate(t.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pie chart */}
        <div className="min-w-0">
          <ExpenseDistributionChart expensesByCategory={filteredByCategory} />
        </div>
      </div>
    </div>
  )
}
