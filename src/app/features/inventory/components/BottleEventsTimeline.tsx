import type { BottleEvent } from '../types'

const EVENT_CONFIG: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  BOTTLE_OPENED: {
    label: 'Botella abierta',
    icon: '🍾',
    color: 'border-amber-500',
  },
  STOCK_ADJUSTED: {
    label: 'Stock ajustado',
    icon: '📦',
    color: 'border-blue-500',
  },
  ML_ADJUSTED: {
    label: 'ML ajustados',
    icon: '💧',
    color: 'border-purple-500',
  },
}

interface BottleEventsTimelineProps {
  events: BottleEvent[]
}

export default function BottleEventsTimeline({
  events,
}: BottleEventsTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <h3 className="font-heading text-sm font-bold text-text uppercase tracking-wider mb-3">
          Historial de botellas
        </h3>
        <p className="text-sm text-text-muted text-center py-6">
          No hay eventos registrados aun.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <h3 className="font-heading text-sm font-bold text-text uppercase tracking-wider mb-4">
        Historial de botellas
      </h3>
      <div className="relative pl-8 space-y-0">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border rounded-full" />
        {events.map((event, i) => {
          const config = EVENT_CONFIG[event.eventType] ?? {
            label: event.eventType,
            icon: '📋',
            color: 'border-border',
          }
          const isFirst = i === 0
          const date = new Date(event.createdAt)

          return (
            <div key={event.id} className="relative pb-5 last:pb-0">
              <div
                className={`absolute -left-8 top-0 w-6 h-6 rounded-full border-2 bg-surface flex items-center justify-center text-xs ${config.color}`}
              >
                {config.icon}
              </div>
              <div>
                <p
                  className={`text-sm font-semibold ${isFirst ? 'text-accent' : 'text-text'}`}
                >
                  {config.label}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                  <span className="text-xs text-text-muted">
                    Selladas: {event.sealedBottlesBefore} →{' '}
                    {event.sealedBottlesAfter}
                  </span>
                  <span className="text-xs text-text-muted">
                    ML abiertos: {event.openMlBefore}ml → {event.openMlAfter}ml
                  </span>
                </div>
                {event.note && (
                  <p className="text-xs text-text-muted mt-1 italic">
                    "{event.note}"
                  </p>
                )}
                <p className="text-xs text-text-muted mt-1">
                  {date.toLocaleDateString('es-EC', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}{' '}
                  —{' '}
                  {date.toLocaleTimeString('es-EC', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {event.createdBy && (
                    <span className="ml-2">por {event.createdBy}</span>
                  )}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
