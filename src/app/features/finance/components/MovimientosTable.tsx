import { useCallback } from 'react'
import { Chip, Input } from '@heroui/react'
import { Search } from 'lucide-react'
import { CustomTableNextUi } from '@/app/components/UI/table-nextui/CustomTableNextUi'
import { CustomPagination } from '@/app/components/UI/table-nextui/CustomPagination'
import { movimientosColumns } from '../data'
import { useMovimientosHook } from '../hooks/useMovimientosHook'
import type { Transaction } from '../types'

interface MovimientosTableProps {
  transactions: Transaction[]
}

export default function MovimientosTable({
  transactions,
}: MovimientosTableProps) {
  const { search, page, totalPages, paginated, handleSearch, setPage } =
    useMovimientosHook(transactions)

  const renderCell = useCallback((item: Transaction, columnKey: string) => {
    switch (columnKey) {
      case 'date':
        return (
          <span className="text-sm text-text">
            {new Date(item.date + 'T00:00:00').toLocaleDateString('es-EC', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        )
      case 'type':
        return (
          <Chip
            size="sm"
            variant="flat"
            color={item.type === 'income' ? 'success' : 'danger'}
          >
            {item.type === 'income' ? 'Ingreso' : 'Egreso'}
          </Chip>
        )
      case 'category':
        return <span className="text-text">{item.category}</span>
      case 'paymentMethod':
        return <span className="text-text">{item.paymentMethod || '—'}</span>
      case 'amount':
        return (
          <span
            className={`font-semibold ${item.type === 'income' ? 'text-green-500' : 'text-red-500'}`}
          >
            {item.type === 'income' ? '+' : '-'}$
            {Number(item.amount).toFixed(2)}
          </span>
        )
      case 'status':
        return (
          <Chip
            size="sm"
            variant="flat"
            color={item.status === 'Pagado' ? 'success' : 'warning'}
          >
            {item.status}
          </Chip>
        )
      case 'description':
        return (
          <span className="text-sm text-text-muted">
            {item.description || '—'}
          </span>
        )
      default:
        return '—'
    }
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-text">Movimientos</h2>
        <Input
          placeholder="Buscar movimiento..."
          value={search}
          onValueChange={handleSearch}
          startContent={<Search size={16} className="text-text-muted" />}
          classNames={{
            base: 'w-full sm:max-w-xs',
            inputWrapper: 'bg-surface-raised border border-border',
            input: 'text-text placeholder:text-text-muted',
          }}
        />
      </div>

      <div className="w-full min-w-0 overflow-x-auto">
        <CustomTableNextUi<Transaction & { id: string | number }>
          items={paginated.map((t) => ({ ...t, id: t.id }))}
          columns={movimientosColumns}
          renderCell={renderCell}
          emptyContent="No hay movimientos registrados"
          bottomContent={
            <CustomPagination
              page={page}
              pages={totalPages}
              setPage={setPage}
            />
          }
        />
      </div>
    </div>
  )
}
