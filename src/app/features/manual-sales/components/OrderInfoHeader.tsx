interface OrderInfoHeaderProps {
  orderNumber: string
}

export default function OrderInfoHeader({ orderNumber }: OrderInfoHeaderProps) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('es-EC', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  const timeStr = now.toLocaleTimeString('es-EC', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-lg font-bold text-text">{orderNumber}</h3>
      <p className="text-sm text-text-muted">
        {dateStr} - {timeStr}
      </p>
      <div className="mt-2 border-b border-border" />
    </div>
  )
}
