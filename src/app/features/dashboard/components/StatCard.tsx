interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  bgImage: string
}

export default function StatCard({
  title,
  value,
  subtitle,
  bgImage,
}: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border min-h-[180px] flex flex-col justify-end">
      <img
        src={bgImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
      <div className="relative z-10 p-5">
        <p className="text-sm font-medium text-white/70">{title}</p>
        <p className="mt-1 text-3xl font-bold text-white">{value}</p>
        {subtitle && <p className="mt-1 text-sm text-white/60">{subtitle}</p>}
      </div>
    </div>
  )
}
