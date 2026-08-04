import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { CHART_COLORS } from '../data'
import type { CashFlowEntry } from '../types'

interface CashFlowChartProps {
  data: CashFlowEntry[]
}

interface SingleSeriesChartProps {
  data: Array<{ date: string; value: number; label: string }>
  color: string
  title: string
  emptyLabel: string
}

function SingleSeriesChart({
  data,
  color,
  title,
  emptyLabel,
}: SingleSeriesChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {title}
          </span>
        </div>
        <span className="text-sm font-bold" style={{ color }}>
          ${total.toFixed(2)}
        </span>
      </div>
      {total === 0 || data.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border bg-bg">
          <p className="text-xs text-text-muted">{emptyLabel}</p>
        </div>
      ) : (
        <div className="h-40 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#3A3636" />
              <XAxis
                dataKey="label"
                tick={{ fill: '#A09A9A', fontSize: 10 }}
                axisLine={{ stroke: '#3A3636' }}
              />
              <YAxis
                tick={{ fill: '#A09A9A', fontSize: 10 }}
                axisLine={{ stroke: '#3A3636' }}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#252222',
                  border: '1px solid #3A3636',
                  borderRadius: 8,
                  color: '#fff',
                }}
                labelStyle={{ color: '#A09A9A' }}
                formatter={(value: any) =>
                  [`$${Number(value).toFixed(2)}`, title] as any
                }
              />
              <Bar
                dataKey="value"
                name={title}
                fill={color}
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default function CashFlowChart({ data }: CashFlowChartProps) {
  // Split into two independent series so income remains visible regardless of expense magnitude
  const incomeSeries = data
    .map((entry) => ({
      date: entry.date,
      value: Number(entry.income || 0),
      label: new Date(entry.date + 'T00:00:00').toLocaleDateString('es-EC', {
        day: '2-digit',
        month: 'short',
      }),
    }))
    .filter((d) => d.value > 0)

  const expenseSeries = data
    .map((entry) => ({
      date: entry.date,
      value: Number(entry.expense || 0),
      label: new Date(entry.date + 'T00:00:00').toLocaleDateString('es-EC', {
        day: '2-digit',
        month: 'short',
      }),
    }))
    .filter((d) => d.value > 0)

  return (
    <div className="min-w-0 rounded-xl border border-border bg-surface p-4 sm:p-5">
      <h3 className="mb-4 text-sm font-semibold text-text">Flujo de Caja</h3>

      <div className="flex flex-col gap-5">
        <SingleSeriesChart
          data={incomeSeries}
          color={CHART_COLORS.income}
          title="Ingresos"
          emptyLabel="Sin ingresos registrados este período"
        />
        <SingleSeriesChart
          data={expenseSeries}
          color={CHART_COLORS.expense}
          title="Egresos"
          emptyLabel="Sin egresos registrados este período"
        />
      </div>
    </div>
  )
}
