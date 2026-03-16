import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { CHART_COLORS } from '../data'
import type { CashFlowEntry } from '../types'

interface CashFlowChartProps {
  data: CashFlowEntry[]
}

export default function CashFlowChart({ data }: CashFlowChartProps) {
  const chartData = data.map((entry) => ({
    ...entry,
    label: new Date(entry.date + 'T00:00:00').toLocaleDateString('es-EC', { day: '2-digit', month: 'short' }),
  }))

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Flujo de Caja</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: CHART_COLORS.income }} />
            <span className="text-xs text-text-muted">Ingresos</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: CHART_COLORS.expense }} />
            <span className="text-xs text-text-muted">Egresos</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3A3636" />
            <XAxis dataKey="label" tick={{ fill: '#A09A9A', fontSize: 11 }} axisLine={{ stroke: '#3A3636' }} />
            <YAxis tick={{ fill: '#A09A9A', fontSize: 11 }} axisLine={{ stroke: '#3A3636' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#252222', border: '1px solid #3A3636', borderRadius: 8, color: '#fff' }}
              labelStyle={{ color: '#A09A9A' }}
            />
            <Legend wrapperStyle={{ display: 'none' }} />
            <Bar dataKey="income" name="Ingresos" fill={CHART_COLORS.income} radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Egresos" fill={CHART_COLORS.expense} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
