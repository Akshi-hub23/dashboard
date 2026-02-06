'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Sensor } from '@/lib/sensor-data'

interface SensorChartProps {
  sensor: Sensor
}

export default function SensorChart({ sensor }: SensorChartProps) {
  const chartData = sensor.readings.map((reading) => ({
    time: reading.timestamp.getHours().toString().padStart(2, '0') + ':00',
    value: reading.value,
    timestamp: reading.timestamp,
  }))

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
          />
          <XAxis
            dataKey="time"
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            style={{ fontSize: '12px' }}
            label={{ value: sensor.unit, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--card-foreground))',
            }}
            labelStyle={{
              color: 'hsl(var(--card-foreground))',
            }}
            formatter={(value) => [
              `${value} ${sensor.unit}`,
              sensor.name,
            ]}
          />
          <Legend
            wrapperStyle={{
              color: 'hsl(var(--muted-foreground))',
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--accent))"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            name={sensor.name}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
