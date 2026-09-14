import type { OrderHistoryItem } from '../types'

interface OrderHistoryTableProps {
  orders: OrderHistoryItem[]
}

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  order_created: { label: 'Pendiente', class: 'bg-amber-100 text-amber-700' },
  order_received: { label: 'Pagado', class: 'bg-blue-100 text-blue-700' },
  order_accepted: { label: 'Pagado', class: 'bg-blue-100 text-blue-700' },
  order_shipped: { label: 'Enviado', class: 'bg-indigo-100 text-indigo-700' },
  order_delivered: { label: 'Entregado', class: 'bg-green-100 text-green-700' },
  order_cancelled: { label: 'Cancelado', class: 'bg-red-100 text-red-700' },
  order_delayed: { label: 'Retrasado', class: 'bg-amber-100 text-amber-700' },
  order_rejected: { label: 'Rechazado', class: 'bg-red-100 text-red-700' },
}

export default function OrderHistoryTable({ orders }: OrderHistoryTableProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <h3 className="font-heading text-sm font-bold text-text uppercase tracking-wider mb-3">
          Historial de órdenes
        </h3>
        <p className="text-sm text-text-muted text-center py-6">
          No hay órdenes registradas para este producto.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h3 className="font-heading text-sm font-bold text-text uppercase tracking-wider mb-4">
        Historial de órdenes
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-3 text-xs text-text-muted font-bold uppercase">
                Orden
              </th>
              <th className="py-2 pr-3 text-xs text-text-muted font-bold uppercase">
                Estado
              </th>
              <th className="py-2 pr-3 text-xs text-text-muted font-bold uppercase">
                Variante
              </th>
              <th className="py-2 pr-3 text-xs text-text-muted font-bold uppercase text-right">
                Cant.
              </th>
              <th className="py-2 text-xs text-text-muted font-bold uppercase">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((item, i) => {
              const status = STATUS_LABELS[item.orderStatus] ?? {
                label: item.orderStatus,
                class: 'bg-gray-100 text-gray-600',
              }
              const date = new Date(item.orderCreatedAt)

              return (
                <tr
                  key={`${item.orderId}-${i}`}
                  className="border-b border-border/50 hover:bg-surface-raised/50 transition-colors"
                >
                  <td className="py-3 pr-3 font-mono font-bold text-text text-xs">
                    {item.orderNumber}
                  </td>
                  <td className="py-3 pr-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${status.class}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-text-muted">
                    {item.variationName || '—'}
                  </td>
                  <td className="py-3 pr-3 text-right text-text font-bold">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-text-muted text-xs">
                    {date.toLocaleDateString('es-EC', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
