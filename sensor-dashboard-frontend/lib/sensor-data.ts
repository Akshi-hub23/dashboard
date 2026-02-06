export interface SensorReading {
  timestamp: Date
  value: number
}

export interface Sensor {
  id: string
  name: string
  type: 'temperature' | 'humidity' | 'soil-moisture' | 'gas' | 'ultrasonic'
  unit: string
  currentValue: number
  minValue: number
  maxValue: number
  avgValue: number
  status: 'normal' | 'warning' | 'critical'
  readings: SensorReading[]
}

export interface Alert {
  id: string
  sensorId: string
  sensorName: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  message: string
  timestamp: Date
  acknowledged: boolean
  muted: boolean
  acknowledgedBy?: string
  acknowledgedAt?: string | Date
}

export interface SensorThresholds {
  warning: number
  critical: number
}

export interface ThresholdSettings {
  temperature: SensorThresholds
  humidity: SensorThresholds
  soilMoisture: SensorThresholds
  gas: SensorThresholds
}


// Generate mock readings for the past 24 hours
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

// Mock sensors data
export const mockSensors: Sensor[] = [
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

// Mock alerts
export const mockAlerts: Alert[] = [
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

export function getSensorColor(type: Sensor['type']): string {
  switch (type) {
    case 'temperature':
      return 'from-orange-500 to-red-500'
    case 'humidity':
      return 'from-blue-500 to-cyan-500'
    case 'soil-moisture':
      return 'from-green-500 to-emerald-500'
    case 'gas':
      return 'from-purple-500 to-pink-500'
    case 'ultrasonic':
      return 'from-amber-500 to-yellow-500'
    default:
      return 'from-gray-500 to-slate-500'
  }
}

export function getSensorIcon(type: Sensor['type']): string {
  switch (type) {
    case 'temperature':
      return '🌡️'
    case 'humidity':
      return '💧'
    case 'soil-moisture':
      return '🌱'
    case 'gas':
      return '💨'
    case 'ultrasonic':
      return '📏'
    default:
      return '📊'
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'critical':
      return 'bg-red-100 text-red-800'
    case 'warning':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-green-100 text-green-800'
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'text-red-600'
    case 'high':
      return 'text-orange-600'
    case 'medium':
      return 'text-yellow-600'
    case 'low':
      return 'text-blue-600'
    default:
      return 'text-gray-600'
  }
}
