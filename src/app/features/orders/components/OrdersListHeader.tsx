import { Button, Input } from '@heroui/react'
import { Search, Calendar, Filter, RefreshCw } from 'lucide-react'
import type { DateFilter } from '../hooks/useOrdersPageHook'
import { ORDER_STATUS_OPTIONS } from '../data'
import { useReconcilePayphoneMutation } from '../mutations/useOrderMutations'

interface OrdersListHeaderProps {
  search: string
  onSearch: (value: string) => void
  dateFilter: DateFilter
  onDateFilter: (value: DateFilter) => void
  statusFilter: string
  onStatusFilter: (value: string) => void
  filteredCount: number
}

const DATE_FILTERS: { value: DateFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'today', label: 'Hoy' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mes' },
]

export default function OrdersListHeader({
  search,
  onSearch,
  dateFilter,
  onDateFilter,
  statusFilter,
  onStatusFilter,
  filteredCount,
}: OrdersListHeaderProps) {
  const reconcileMutation = useReconcilePayphoneMutation()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide text-accent">
            Ordenes
          </h1>
          <p className="text-xs text-text-muted mt-0.5">{filteredCount} ordenes</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button
            size="sm"
            variant="flat"
            color="warning"
            startContent={<RefreshCw size={14} className={reconcileMutation.isPending ? 'animate-spin' : ''} />}
            isLoading={reconcileMutation.isPending}
            onPress={() => reconcileMutation.mutate()}
          >
            Reconciliar PayPhone
          </Button>

          <Input
            placeholder="Buscar por N. orden o cliente..."
            value={search}
            onValueChange={onSearch}
            startContent={<Search size={16} className="text-text-muted" />}
            classNames={{
              base: 'max-w-xs',
              inputWrapper: 'bg-surface-raised border border-border',
              input: 'text-text placeholder:text-text-muted',
            }}
          />
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2">
        <Calendar size={14} className="text-text-muted" />
        {DATE_FILTERS.map((f) => (
          <Button
            key={f.value}
            size="sm"
            variant={dateFilter === f.value ? 'solid' : 'flat'}
            color={dateFilter === f.value ? 'warning' : 'default'}
            onPress={() => onDateFilter(f.value)}
            className="min-w-0 px-3 text-xs"
          >
            {f.label}
          </Button>
        ))}

        <div className="w-px h-5 bg-border mx-1" />

        <Filter size={14} className="text-text-muted" />
        <Button
          size="sm"
          variant={statusFilter === 'all' ? 'solid' : 'flat'}
          color={statusFilter === 'all' ? 'warning' : 'default'}
          onPress={() => onStatusFilter('all')}
          className="min-w-0 px-3 text-xs"
        >
          Todos
        </Button>
        {ORDER_STATUS_OPTIONS.slice(0, 5).map((s) => (
          <Button
            key={s.value}
            size="sm"
            variant={statusFilter === s.value ? 'solid' : 'flat'}
            color={statusFilter === s.value ? 'warning' : 'default'}
            onPress={() => onStatusFilter(s.value)}
            className="min-w-0 px-3 text-xs"
          >
            {s.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
