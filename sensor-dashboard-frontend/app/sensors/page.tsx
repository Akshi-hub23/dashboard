'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { fetchSensors } from '@/lib/api'
import { getSensorIcon, Sensor } from '@/lib/sensor-data'
import Header from '@/components/header'
import SensorChart from '@/components/sensor-chart'
import { Suspense } from 'react'

function SensorPageContent() {
  const searchParams = useSearchParams()
  const sensorId = searchParams.get('id')
  const [sensors, setSensors] = useState<Sensor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchSensors()
        setSensors(data)
      } catch (error) {
        console.error('Failed to fetch sensors:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading sensors...</p>
      </div>
    )
  }

  const selectedSensor = sensorId
    ? sensors.find((s) => s.id === sensorId) || sensors[0]
    : sensors[0]

  if (!selectedSensor) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Sensor not found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Sensors" subtitle="Real-time sensor data and historical trends" />

      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sensor List */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border border-border p-4 sticky top-0">
              <h3 className="font-bold text-card-foreground mb-3">
                Sensors
              </h3>
              <div className="space-y-2">
                {sensors.map((sensor) => (
                  <Link
                    key={sensor.id}
                    href={`/sensors?id=${sensor.id}`}
                    className={`block p-3 rounded-lg transition-colors ${
                      selectedSensor.id === sensor.id
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-background hover:bg-secondary text-card-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">
                        {getSensorIcon(sensor.type)}
                      </span>
                      <span className="text-sm font-medium line-clamp-1">
                        {sensor.name}
                      </span>
                    </div>
                    <div className="text-xs text-opacity-75">
                      {sensor.currentValue} {sensor.unit}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Area */}
          <div className="lg:col-span-3">
            {/* Sensor Details */}
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">
                      {getSensorIcon(selectedSensor.type)}
                    </span>
                    <div>
                      <h2 className="text-2xl font-bold text-card-foreground">
                        {selectedSensor.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {selectedSensor.type.replace('-', ' ')}
                      </p>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedSensor.status === 'critical'
                      ? 'bg-red-100 text-red-800'
                      : selectedSensor.status === 'warning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                  }`}
                >
                  {selectedSensor.status.charAt(0).toUpperCase() +
                    selectedSensor.status.slice(1)}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">
                    Current Value
                  </p>
                  <p className="text-2xl font-bold text-accent mt-1">
                    {selectedSensor.currentValue}
                    <span className="text-sm text-muted-foreground ml-1">
                      {selectedSensor.unit}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    Average
                  </p>
                  <p className="text-2xl font-bold text-card-foreground mt-1">
                    {selectedSensor.avgValue}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    Minimum
                  </p>
                  <p className="text-2xl font-bold text-card-foreground mt-1">
                    {selectedSensor.minValue}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    Maximum
                  </p>
                  <p className="text-2xl font-bold text-card-foreground mt-1">
                    {selectedSensor.maxValue}
                  </p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-bold text-card-foreground mb-4">
                24-Hour Trend
              </h3>
              <SensorChart sensor={selectedSensor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SensorsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <SensorPageContent />
    </Suspense>
  )
}
