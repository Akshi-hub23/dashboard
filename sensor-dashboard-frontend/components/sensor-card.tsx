import { Sensor, getSensorIcon } from '@/lib/sensor-data'
import Link from 'next/link'

interface SensorCardProps {
  sensor: Sensor
}

export default function SensorCard({ sensor }: SensorCardProps) {
  const statusColor =
    sensor.status === 'critical'
      ? 'bg-red-100 text-red-800'
      : sensor.status === 'warning'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-green-100 text-green-800'

  const trendArrow =
    sensor.currentValue > sensor.avgValue ? '↑' : '↓'
  const trendColor =
    sensor.currentValue > sensor.avgValue
      ? 'text-red-600'
      : 'text-green-600'

  return (
    <Link href={`/sensors?id=${sensor.id}`}>
      <div className="bg-card rounded-lg p-6 border border-border hover:border-accent hover:shadow-lg transition-all cursor-pointer h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-card-foreground text-lg">
              {sensor.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{sensor.type}</p>
          </div>
          <span className={`text-2xl ${statusColor} rounded px-3 py-1 inline-block`}>
            {getSensorIcon(sensor.type)}
          </span>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
          >
            {sensor.status.charAt(0).toUpperCase() +
              sensor.status.slice(1)}
          </span>
        </div>

        {/* Value Display */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-accent">
              {sensor.currentValue}
            </span>
            <span className="text-muted-foreground text-sm">
              {sensor.unit}
            </span>
          </div>
          <div className="flex gap-4 mt-3 text-sm">
            <div>
              <p className="text-muted-foreground">Min/Max</p>
              <p className="text-card-foreground font-semibold">
                {sensor.minValue} - {sensor.maxValue}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Average</p>
              <p className="text-card-foreground font-semibold">
                {sensor.avgValue}
              </p>
            </div>
          </div>
        </div>

        {/* Trend */}
        <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
          <span>{trendArrow}</span>
          <span>
            {Math.abs(
              Number(
                (sensor.currentValue - sensor.avgValue).toFixed(1)
              )
            )}
            {sensor.unit}
          </span>
          <span className="text-muted-foreground">
            vs average
          </span>
        </div>
      </div>
    </Link>
  )
}
