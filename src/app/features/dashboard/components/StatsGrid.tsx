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
        bgImage="/products-home.png"
      />
      <StatCard
        title="Combos"
        value={stats.combos?.total ?? 0}
        subtitle={`${stats.combos?.active ?? 0} activos`}
        bgImage="/combos-home.png"
      />
      <StatCard
        title="Stock"
        value={stats.stock.available}
        subtitle={`${stats.stock.lowStock} con stock bajo`}
        bgImage="/stock.png"
      />
      <StatCard
        title="Banners"
        value={stats.banners.total}
        subtitle={`${stats.banners.visible} visibles`}
        bgImage="/banner-promotions-home.png"
      />
      <StatCard
        title="Clientes"
        value={stats.users.clients}
        subtitle={`${stats.users.total} usuarios totales`}
        bgImage="/products-home.png"
      />
      <StatCard
        title="Órdenes"
        value={stats.orders.total}
        subtitle={`$${(stats.orders.totalRevenue ?? 0).toFixed(2)} en ventas`}
        bgImage="/combos-home.png"
      />
    </div>
  )
}
