'use client'

import { getSensorIcon, Sensor } from '@/lib/sensor-data'
import Header from '@/components/header'
import { useState, useEffect } from 'react'
import { fetchSensors } from '@/lib/api'
import { ChevronUp, ChevronDown } from 'lucide-react'

export default function RawDataPage() {
  const [sensors, setSensors] = useState<Sensor[]>([])
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchSensors()
        setSensors(data)
        if (data.length > 0) {
           setSelectedSensor(data[0])
        }
      } catch (error) {
        console.error('Failed to fetch sensors:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading || !selectedSensor) {
     return (
       <div className="flex items-center justify-center h-full">
         <p className="text-muted-foreground">Loading data...</p>
       </div>
     )
  }

  const sortedReadings = [...selectedSensor.readings].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime()
    const timeB = new Date(b.timestamp).getTime()
    return sortOrder === 'desc'
      ? timeB - timeA
      : timeA - timeB
  })

  const toggleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Raw Data"
        subtitle="Export and analyze sensor readings"
      />

      <div className="flex-1 overflow-auto p-8">
        {/* Sensor Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Select Sensor
          </label>
          <select
            value={selectedSensor.id}
            onChange={(e) => {
              const sensor = sensors.find((s) => s.id === e.target.value)
              if (sensor) setSelectedSensor(sensor)
            }}
            className="w-full md:w-64 px-4 py-2 border border-border rounded-lg bg-card text-card-foreground"
          >
            {sensors.map((sensor) => (
              <option key={sensor.id} value={sensor.id}>
                {getSensorIcon(sensor.type)} {sensor.name}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {/* Header */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">
                    <button
                      onClick={toggleSort}
                      className="flex items-center gap-2 hover:text-accent"
                    >
                      Timestamp
                      {sortOrder === 'desc' ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronUp size={16} />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-card-foreground">
                    Deviation
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedReadings.map((reading, index) => {
                  const deviation = reading.value - selectedSensor.avgValue
                  const isAbnormal = Math.abs(deviation) > 10

                  return (
                    <tr
                      key={index}
                      className={`border-b border-border hover:bg-secondary/50 transition-colors ${
                        isAbnormal ? 'bg-red-50' : ''
                      }`}
                    >
                      <td className="px-6 py-3 text-sm text-card-foreground">
                        {reading.timestamp.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-sm font-semibold text-accent">
                        {reading.value} {selectedSensor.unit}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isAbnormal
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {isAbnormal ? 'Abnormal' : 'Normal'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <span
                          className={
                            deviation > 0
                              ? 'text-red-600 font-medium'
                              : 'text-green-600 font-medium'
                          }
                        >
                          {deviation > 0 ? '+' : ''}
                          {deviation.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-border bg-secondary text-sm text-muted-foreground">
            Showing {sortedReadings.length} readings from the last 24 hours
          </div>
        </div>

        {/* Export Section */}
        <div className="mt-6 bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold text-card-foreground mb-4">Export Data</h3>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
              Export as CSV
            </button>
            <button className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm font-medium text-card-foreground">
              Export as JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
