import { Router } from 'express'
import { getSensors, getSensorById } from '../controllers/sensors'
import { getAlerts, acknowledgeAlert } from '../controllers/alerts'
import { getSettings, updateSettings } from '../controllers/settings'

const router = Router()

router.get('/sensors', getSensors)
router.get('/sensors/:id', getSensorById)
router.get('/alerts', getAlerts)
router.patch('/alerts/:id/acknowledge', acknowledgeAlert)
router.get('/settings', getSettings)
router.post('/settings', updateSettings)

export default router
