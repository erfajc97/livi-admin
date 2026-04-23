import { Chip, Spinner } from '@heroui/react'
import {
  DollarSign,
  Clock,
  Package,
  AlertTriangle,
  CreditCard,
  CheckCircle,
  Truck,
  PackageCheck,
  TrendingUp,
} from 'lucide-react'
import { useCallback, useState, useMemo } from 'react'
import { useAuthStore } from '@/app/store/auth/authStore'
import { useDashboardStatsQuery } from '@/app/tanstack-queries/dashboardQuery'
import { CustomTableNextUi } from '@/app/components/UI/table-nextui/CustomTableNextUi'
import { CustomPagination } from '@/app/components/UI/table-nextui/CustomPagination'
import WelcomeBanner from './components/WelcomeBanner'
import MetricCard from './components/MetricCard'
import StatusCard from './components/StatusCard'
import { STATUS_LABELS, recentOrderColumns } from './data'
import type { RecentOrder } from './types'

const ORDERS_PER_PAGE = 5

export function DashboardMetrics() {
  const { userName } = useAuthStore()
  const { data: stats, isLoading } = useDashboardStatsQuery()
  const [orderPage, setOrderPage] = useState(1)

  const recentOrders = stats?.orders.recent ?? []
  const totalOrderPages = Math.ceil(recentOrders.length / ORDERS_PER_PAGE)

  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * ORDERS_PER_PAGE
    return recentOrders.slice(start, start + ORDERS_PER_PAGE)
  }, [recentOrders, orderPage])

  const renderCell = useCallback((item: RecentOrder, columnKey: string) => {
    switch (columnKey) {
      case 'total':
        return <span className="font-semibold">${Number(item.total).toFixed(2)}</span>
      case 'status': {
        const info = STATUS_LABELS[item.status] || { label: item.status, color: 'default' as const }
        return <Chip size="sm" variant="flat" color={info.color}>{info.label}</Chip>
      }
      default:
        return item[columnKey as keyof RecentOrder] ?? '—'
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner size="lg" color="warning" />
      </div>
    )
  }

  if (!stats) {
    return <p className="p-6 text-text-muted">No se pudieron cargar las estadísticas.</p>
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <WelcomeBanner userName={userName} subtitle="Aquí tienes tus métricas de ventas" />

      {/* Top metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Ventas de hoy"
          value={`$${(stats.orders.todayRevenue ?? 0).toFixed(2)}`}
          subtitle={`${stats.orders.todayOrders ?? 0} ${(stats.orders.todayOrders ?? 0) === 1 ? 'orden' : 'órdenes'} hoy`}
          icon={DollarSign}
        />
        <MetricCard
          title="Ventas totales"
          value={`$${(stats.orders.totalRevenue ?? 0).toFixed(2)}`}
          subtitle={`${stats.orders.totalPaidOrders ?? 0} órdenes pagadas`}
          icon={TrendingUp}
        />
        <MetricCard
          title="Pedidos pendientes"
          value={stats.orders.byStatus.pending}
          subtitle={`${stats.orders.byStatus.delayed} retrasados`}
          icon={Clock}
        />
        <MetricCard
          title="Stock crítico"
          value={stats.stock.lowStock}
          subtitle={`${stats.stock.available} unidades disponibles`}
          icon={AlertTriangle}
        />
      </div>

      {/* Gestión de pedidos */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-text">Gestión de pedidos</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatusCard icon={Clock} count={stats.orders.byStatus.pending} label="Pendiente de pago" color="bg-yellow-600" />
          <StatusCard icon={CreditCard} count={stats.orders.byStatus.paid} label="Pagados" color="bg-green-600" />
          <StatusCard icon={PackageCheck} count={stats.orders.byStatus.accepted} label="Listos despachar" color="bg-blue-600" />
          <StatusCard icon={Truck} count={stats.orders.byStatus.shipped} label="En trámite envío" color="bg-purple-600" />
          <StatusCard icon={CheckCircle} count={stats.orders.byStatus.delivered} label="Entregados" color="bg-emerald-600" />
        </div>
      </div>

      {/* Recent orders table */}
      <div>
        <CustomTableNextUi<RecentOrder & { id: string | number }>
          items={paginatedOrders.map((o) => ({ ...o, id: o.id }))}
          columns={recentOrderColumns}
          renderCell={renderCell}
          emptyContent="No hay órdenes recientes"
          bottomContent={
            totalOrderPages > 1 ? (
              <CustomPagination
                page={orderPage}
                pages={totalOrderPages}
                setPage={setOrderPage}
              />
            ) : undefined
          }
        />
      </div>
    </div>
  )
}
