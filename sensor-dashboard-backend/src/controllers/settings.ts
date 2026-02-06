import { Request, Response } from 'express'
import { thresholds, updateThresholds } from '../data/store'

export const getSettings = (req: Request, res: Response) => {
  res.json(thresholds)
}

export const updateSettings = (req: Request, res: Response) => {
  const newThresholds = req.body
  
  if (!newThresholds) {
    res.status(400).json({ message: 'Threshold settings are required' })
    return
  }

  updateThresholds(newThresholds)
  res.json({ message: 'Settings updated successfully', thresholds })
}
