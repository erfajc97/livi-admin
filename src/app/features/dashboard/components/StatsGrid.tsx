import StatCard from './StatCard'
import type { DashboardStats } from '../types'

interface StatsGridProps {
  stats: DashboardStats
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Productos"
        value={stats.products.total}
        subtitle={`${stats.categories.total} categorías`}
        bgImage="/products-home.jpg"
      />
      <StatCard
        title="Stock"
        value={stats.stock.available}
        subtitle={`${stats.stock.lowStock} con stock bajo`}
        bgImage="/stock.jpg"
      />
      <StatCard
        title="Clientes"
        value={stats.users.clients}
        subtitle={`${stats.users.total} usuarios totales`}
        bgImage="/clientes.jpg"
      />
      <StatCard
        title="Órdenes"
        value={stats.orders.total}
        subtitle={`$${(stats.orders.totalRevenue ?? 0).toFixed(2)} en ventas`}
        bgImage="/ordenes.jpg"
      />
    </div>
  )
}
