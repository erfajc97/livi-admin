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
        subtitle={`${stats.products.decants} decants`}
        bgImage="/products-home.png"
      />
      <StatCard
        title="Combos Disponibles"
        value={stats.products.decants}
        subtitle="Variantes activas"
        bgImage="/combos-home.png"
      />
      <StatCard
        title="Stock Productos"
        value={`${stats.stock.available}`}
        subtitle={`Disponible: ${stats.stock.available}/${stats.stock.capacity}`}
        bgImage="/stock.png"
      />
      <StatCard
        title="Banners Promocionales"
        value={stats.banners.total}
        subtitle={`${stats.banners.visible} visibles actualmente`}
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
        subtitle={`${stats.categories.total} categorías`}
        bgImage="/combos-home.png"
      />
    </div>
  )
}
