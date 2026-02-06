import { Sensor, Alert, ThresholdSettings } from './sensor-data'

const API_BASE_URL = 'http://localhost:4000/api'

// Helper to convert timestamp strings to Date objects
function convertSensorDates(sensor: any): Sensor {
  return {
    ...sensor,
    readings: sensor.readings.map((reading: any) => ({
      ...reading,
      timestamp: new Date(reading.timestamp)
    }))
  }
}

export async function fetchSensors(): Promise<Sensor[]> {
  const response = await fetch(`${API_BASE_URL}/sensors`)
  if (!response.ok) {
    throw new Error('Failed to fetch sensors')
  }
  const data = await response.json()
  return data.map(convertSensorDates)
}

export async function fetchSensorById(id: string): Promise<Sensor> {
  const response = await fetch(`${API_BASE_URL}/sensors/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch sensor')
  }
  const data = await response.json()
  return convertSensorDates(data)
}

export async function fetchAlerts(): Promise<Alert[]> {
  const response = await fetch(`${API_BASE_URL}/alerts`)
  if (!response.ok) {
    throw new Error('Failed to fetch alerts')
  }
  const data = await response.json()
  return data.map((alert: any) => ({
    ...alert,
    timestamp: new Date(alert.timestamp),
    acknowledgedAt: alert.acknowledgedAt ? new Date(alert.acknowledgedAt) : undefined
  }))
}

export async function acknowledgeAlert(id: string): Promise<Alert> {
  const response = await fetch(`${API_BASE_URL}/alerts/${id}/acknowledge`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (!response.ok) {
    throw new Error('Failed to acknowledge alert')
  }
  const data = await response.json()
  return {
    ...data,
    timestamp: new Date(data.timestamp),
    acknowledgedAt: data.acknowledgedAt ? new Date(data.acknowledgedAt) : undefined
  }
}

export async function fetchSettings(): Promise<ThresholdSettings> {
  const response = await fetch(`${API_BASE_URL}/settings`)
  if (!response.ok) {
    throw new Error('Failed to fetch settings')
  }
  return response.json()
}

export async function saveSettings(settings: ThresholdSettings): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(settings)
  })
  if (!response.ok) {
    throw new Error('Failed to save settings')
  }
}

