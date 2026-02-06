import { Sensor, Alert, SensorReading, ThresholdSettings } from './sensor-data'

// NOTE: Since this runs in Next.js Serverless environment, 
// if we use a simple variable, it might reset between invocations.
// For a production app, we would use a database.
// For now, we'll use a global variable pattern that persists in dev/limited prod.

// Mock data generation (ported from backend)
export function generateMockReadings(
  baseValue: number,
  min: number,
  max: number,
  variance: number = 5
): SensorReading[] {
  const readings: SensorReading[] = []
  const now = new Date()

  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now)
    timestamp.setHours(timestamp.getHours() - i)
    const randomVariance = (Math.random() - 0.5) * variance * 2
    const value = Math.max(
      min,
      Math.min(max, baseValue + randomVariance)
    )
    readings.push({
      timestamp,
      value: Number(value.toFixed(2)),
    })
  }

  return readings
}

// Global store
let sensors: Sensor[] = [
  {
    id: 'temp-1',
    name: 'Temperature Sensor 1',
    type: 'temperature',
    unit: '°C',
    currentValue: 28.5,
    minValue: 20,
    maxValue: 35,
    avgValue: 26.2,
    status: 'normal',
    readings: generateMockReadings(26, 20, 30),
  },
  {
    id: 'humidity-2',
    name: 'Humidity Sensor 2',
    type: 'humidity',
    unit: '%',
    currentValue: 62,
    minValue: 30,
    maxValue: 90,
    avgValue: 58.5,
    status: 'normal',
    readings: generateMockReadings(58, 30, 85),
  },
  {
    id: 'soil-3',
    name: 'Soil Moisture Sensor 3',
    type: 'soil-moisture',
    unit: '%',
    currentValue: 45,
    minValue: 20,
    maxValue: 80,
    avgValue: 50.2,
    status: 'normal',
    readings: generateMockReadings(50, 20, 80),
  },
  {
    id: 'gas-4',
    name: 'Gas Sensor 4',
    type: 'gas',
    unit: 'ppm',
    currentValue: 150,
    minValue: 0,
    maxValue: 500,
    avgValue: 140.8,
    status: 'normal',
    readings: generateMockReadings(140, 80, 200),
  },
  {
    id: 'ultrasonic-5',
    name: 'Ultrasonic Distance Sensor 5',
    type: 'ultrasonic',
    unit: 'cm',
    currentValue: 125.3,
    minValue: 0,
    maxValue: 400,
    avgValue: 123.5,
    status: 'normal',
    readings: generateMockReadings(123, 100, 150),
  },
]

let alerts: Alert[] = [
  {
    id: 'alert-1',
    sensorId: 'temp-1',
    sensorName: 'Temperature Sensor 1',
    severity: 'critical',
    message: 'Temperature exceeded critical threshold (35°C). Immediate action required to prevent equipment damage.',
    timestamp: new Date(Date.now() - 10 * 60000),
    acknowledged: false,
    muted: false,
  },
  {
    id: 'alert-2',
    sensorId: 'humidity-2',
    sensorName: 'Humidity Sensor 2',
    severity: 'high',
    message: 'Humidity level is unusually high (85%). Risk of mold growth in storage area.',
    timestamp: new Date(Date.now() - 15 * 60000),
    acknowledged: false,
    muted: false,
  },
  {
    id: 'alert-3',
    sensorId: 'gas-4',
    sensorName: 'Air Quality Sensor 3',
    severity: 'medium',
    message: 'PM2.5 concentration slightly elevated. Monitor for further increases.',
    timestamp: new Date(Date.now() - 20 * 60000),
    acknowledged: true,
    muted: false,
  },
  {
    id: 'alert-4',
    sensorId: 'soil-3',
    sensorName: 'Soil Moisture Sensor 4',
    severity: 'medium',
    message: 'Soil moisture dropped below optimal level. Consider light irrigation cycle.',
    timestamp: new Date(Date.now() - 25 * 60000),
    acknowledged: false,
    muted: false,
  },
]

let thresholds: ThresholdSettings = {
  temperature: { warning: 30, critical: 35 },
  humidity: { warning: 75, critical: 85 },
  soilMoisture: { warning: 30, critical: 20 },
  gas: { warning: 300, critical: 500 },
}

// Store helpers
export const getSensors = () => sensors
export const getSensorById = (id: string) => sensors.find(s => s.id === id)
export const getAlerts = () => alerts
export const acknowledgeAlert = (id: string) => {
  const alert = alerts.find(a => a.id === id)
  if (alert) {
    alert.acknowledged = true
    alert.acknowledgedBy = 'Admin'
    alert.acknowledgedAt = new Date()
  }
  return alert
}
export const getThresholds = () => thresholds
export const updateThresholds = (newThresholds: ThresholdSettings) => {
  thresholds = { ...newThresholds }
  return thresholds
}
