import { Router } from 'express'
import AppointmentController from '@/controller/appointment.controller'

const appointmentRouter = Router()
const appointmentController = new AppointmentController()

appointmentRouter.post('/api/appointments', appointmentController.create)
appointmentRouter.get('/api/appointments', appointmentController.index)
appointmentRouter.put('/api/appointments/:id', appointmentController.update)
appointmentRouter.get('/api/available-days', appointmentController.listAvailableDays)
appointmentRouter.get('/api/available-times', appointmentController.listAvailableTimes)

export default appointmentRouter
