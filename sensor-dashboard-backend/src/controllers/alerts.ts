import { Request, Response } from 'express'
import { alerts } from '../data/store'

export const getAlerts = (req: Request, res: Response) => {
  res.json(alerts)
}

export const acknowledgeAlert = (req: Request, res: Response) => {
  const { id } = req.params
  const alert = alerts.find((a) => a.id === id)

  if (!alert) {
     res.status(404).json({ message: 'Alert not found' })
     return
  }

  alert.acknowledged = true
  alert.acknowledgedBy = 'Admin'
  alert.acknowledgedAt = new Date()
  res.json(alert)
}
