import { Request, Response } from 'express'
import { sensors } from '../data/store'

export const getSensors = (req: Request, res: Response) => {
  // Return summary of sensors (without full reading history for performance, potentially)
  // For now, returning everything as in the mock
  res.json(sensors)
}

export const getSensorById = (req: Request, res: Response) => {
  const { id } = req.params
  const sensor = sensors.find((s) => s.id === id)

  if (!sensor) {
    res.status(404).json({ message: 'Sensor not found' })
    return
  }

  res.json(sensor)
}
