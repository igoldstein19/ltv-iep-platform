'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { format } from 'date-fns'
import { ProgressEntry } from '@/types'

interface ProgressChartProps {
  entries: ProgressEntry[]
  targetScore?: number
  color?: string
  height?: number
  showGrid?: boolean
}

interface ChartDataPoint {
  date: string
  score: number | null
  fullDate: string
  notes: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataPoint
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 max-w-xs">
        <p className="text-xs font-semibold text-slate-700 mb-1">{data.fullDate}</p>
        <p className="text-lg font-bold text-indigo-600">{payload[0].value}%</p>
        {data.notes && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{data.notes}</p>
        )}
      </div>
    )
  }
  return null
}

export default function ProgressChart({
  entries,
  targetScore,
  color = '#6366F1',
  height = 200,
  showGrid = true,
}: ProgressChartProps) {
  const validEntries = entries
    .filter((e) => e.score !== null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (validEntries.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-slate-50 rounded-xl"
        style={{ height }}
      >
        <p className="text-sm text-slate-400">No data points yet</p>
      </div>
    )
  }

  const data: ChartDataPoint[] = validEntries.map((entry) => ({
    date: format(new Date(entry.date), 'MMM d'),
    score: entry.score ?? null,
    fullDate: format(new Date(entry.date), 'MMMM d, yyyy'),
    notes: entry.notes || '',
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
        )}
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: '#94A3B8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        {targetScore && (
          <ReferenceLine
            y={targetScore}
            stroke="#10B981"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{ value: 'Target', position: 'right', fontSize: 10, fill: '#10B981' }}
          />
        )}
        <Line
          type="monotone"
          dataKey="score"
          stroke={color}
          strokeWidth={2.5}
          dot={{ r: 4, fill: color, strokeWidth: 2, stroke: 'white' }}
          activeDot={{ r: 6, fill: color, stroke: 'white', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
