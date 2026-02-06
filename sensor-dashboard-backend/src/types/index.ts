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
  acknowledgedAt?: Date
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
