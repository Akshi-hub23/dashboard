'use client'

import { useState, useEffect } from 'react'
import { fetchSensors } from '@/lib/api'
import { Sensor } from '@/lib/sensor-data'
import SensorCard from '@/components/sensor-card'
import Header from '@/components/header'

export default function OverviewPage() {
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
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  const normalSensors = sensors.filter((s) => s.status === 'normal')
  const warningSensors = sensors.filter((s) => s.status === 'warning')
  const criticalSensors = sensors.filter((s) => s.status === 'critical')

  return (
    <div className="flex flex-col h-full">
      <Header title="Overview" />

      <div className="flex-1 overflow-auto p-8">
        {/* Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="text-sm text-muted-foreground">Total Sensors</div>
            <div className="text-3xl font-bold text-card-foreground mt-2">
              {sensors.length}
            </div>
            <div className="text-xs text-muted-foreground mt-2">All online</div>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="text-sm text-muted-foreground">Normal Status</div>
            <div className="text-3xl font-bold text-green-600 mt-2">
              {normalSensors.length}
            </div>
            <div className="text-xs text-muted-foreground mt-2">Operating normally</div>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="text-sm text-muted-foreground">Alerts</div>
            <div className="text-3xl font-bold text-red-600 mt-2">
              {warningSensors.length + criticalSensors.length}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Require attention
            </div>
          </div>
        </div>

        {/* Sensors Grid */}
        <h2 className="text-xl font-bold text-card-foreground mb-4">Active Sensors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sensors.map((sensor) => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      </div>
    </div>
  )
}
