interface StatusCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>
  count: number
  label: string
  color: string
}

export default function StatusCard({ icon: Icon, count, label, color }: StatusCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
      <div className={`rounded-lg p-2 ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-text">
          {String(count).padStart(2, '0')}
        </p>
        <p className="text-xs text-text-muted">{label}</p>
      </div>
    </div>
  )
}
