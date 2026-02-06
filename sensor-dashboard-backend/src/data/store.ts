import { Sensor, Alert, SensorReading, ThresholdSettings } from '../types'
import fs from 'fs'
import path from 'path'

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'thresholds.json')

// Global thresholds store
let currentThresholds: ThresholdSettings = {
  temperature: { warning: 30, critical: 35 },
  humidity: { warning: 75, critical: 85 },
  soilMoisture: { warning: 30, critical: 20 },
  gas: { warning: 300, critical: 500 },
}

// Ensure data directory exists
const ensureDataDir = () => {
  const dir = path.dirname(SETTINGS_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Load settings from file
const loadSettings = () => {
  try {
    ensureDataDir()
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf8')
      currentThresholds = JSON.parse(data)
      console.log('Settings loaded from disk')
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
}

// Save settings to file
const saveSettingsToFile = (settings: ThresholdSettings) => {
  try {
    ensureDataDir()
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2))
    console.log('Settings saved to disk')
  } catch (error) {
    console.error('Failed to save settings to disk:', error)
  }
}

export { currentThresholds as thresholds }

export const updateThresholds = (newThresholds: ThresholdSettings) => {
  currentThresholds = { ...newThresholds }
  saveSettingsToFile(currentThresholds)
}

// Initial load
loadSettings()


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
export const sensors: Sensor[] = [
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
export const alerts: Alert[] = [
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
