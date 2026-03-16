interface MetricCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

export default function MetricCard({ title, value, subtitle, icon: Icon }: MetricCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-5 min-h-[140px]">
      <div className="flex items-start justify-between">
        <p className="text-sm text-text-muted">{title}</p>
        <div className="rounded-full bg-accent/10 p-2">
          <Icon size={18} className="text-accent" />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-text">{value}</p>
        <p className="mt-1 text-xs text-text-muted">{subtitle}</p>
      </div>
      <p className="mt-2 text-xs text-accent cursor-pointer hover:underline">Ver detalles</p>
    </div>
  )
}
